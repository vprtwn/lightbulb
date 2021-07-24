import React, { useState, useEffect, useRef } from 'react';
import { Card, Box, Button, Flex, IconButton, Input } from 'theme-ui';
import fetchJson from '../lib/fetchJson';
import NumberFormat from 'react-number-format';
import MinusButtonIcon from './MinusButtonIcon';
import PlusButtonIcon from './PlusButtonIcon';

const PaymentBlock = (props) => {
  const [showingForm, setShowingForm] = useState(false);
  const [amount, setAmount] = useState(100);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (showingForm) {
      firstInputRef.current.focus();
    }
  }, [showingForm]);

  const handleCheckout = async (e) => {
    if (e) {
      e.preventDefault();
    }
    const body = { amount: amount, message: firstInputRef.current.value };
    let checkoutSessionUrl = null;
    try {
      const response = await fetchJson('/api/create_checkout_session', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      checkoutSessionUrl = response.url;
    } catch (e) {
      // TODO: handle errors (in this entire function)
      console.error(e);
      return;
    }

    if (!checkoutSessionUrl) {
      console.error('create checkout session failed');
      return;
    }

    window.location.assign(checkoutSessionUrl);
  };

  return (
    <Card
      variant="card_payment"
      sx={{
        mt: 4,
      }}
    >
      {showingForm && (
        <Card variant="card_payment_form" as="form" onSubmit={handleCheckout}>
          <Flex sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <IconButton
              type="button"
              sx={{ p: 4 }}
              onClick={() => {
                if (amount > 100) {
                  setAmount(amount - 100);
                }
              }}
            >
              <MinusButtonIcon />
            </IconButton>
            <Box sx={{ textAlign: 'center' }}>
              <NumberFormat
                name="amount"
                id="amount"
                decimalScale={0}
                allowEmptyFormatting={true}
                allowNegative={false}
                type="tel"
                // defaultValue={(props.defaultAmount as number) / 100.0}
                displayType={'input'}
                thousandSeparator={true}
                prefix={'$'}
                customInput={Input}
                value={(amount as number) / 100.0}
                renderText={(value) => <Input value={value}></Input>}
                onValueChange={(values) => setAmount(~~(values.floatValue * 100))}
              />
            </Box>
            <IconButton
              type="button"
              sx={{ p: 4 }}
              onClick={() => {
                setAmount(amount + 100);
              }}
            >
              <PlusButtonIcon />
            </IconButton>
          </Flex>
          <Input
            variant="input_payment_message"
            name="message"
            id="message"
            placeholder="Message"
            mt={1}
            mb={3}
            ref={firstInputRef}
          />
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Button
              type="button"
              variant="button_emphasis"
              onClick={() => {
                setShowingForm(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="button_emphasis"
              type="submit"
              onClick={() => {
                //todo
              }}
            >
              Continue
            </Button>
          </Flex>
        </Card>
      )}
      {!showingForm && (
        <Flex sx={{ justifyContent: 'space-between', py: 2 }}>
          <Button
            variant="button_emphasis"
            sx={{ flexGrow: 1 }}
            onClick={() => {
              setShowingForm(true);
            }}
          >
            Leave a tip
          </Button>
        </Flex>
      )}
    </Card>
  );
};
export default PaymentBlock;