import { Input, InputGroup, Stack, StackProps, Text } from '@stacks/ui';
import { ErrorLabel } from '@components/error-label';
import React, { memo } from 'react';

interface RecipientField extends StackProps {
  value: string;
  onChange?: any;
  error?: string;
}
// TODO: this should use a new "Field" component (with inline label like in figma)
export const RecipientField = memo(({ value, onChange, error, ...rest }: RecipientField) => {
  return (
    <Stack width="100%" {...rest}>
      <InputGroup flexDirection="column">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="recipient"
        >
          Recipient
        </Text>
        <Input
          display="block"
          type="string"
          width="100%"
          name="recipient"
          value={value}
          onChange={onChange}
          placeholder="Enter an address"
          autoComplete="off"
        />
      </InputGroup>
      {error && (
        <ErrorLabel>
          <Text textStyle="caption">{error}</Text>
        </ErrorLabel>
      )}
    </Stack>
  );
});
