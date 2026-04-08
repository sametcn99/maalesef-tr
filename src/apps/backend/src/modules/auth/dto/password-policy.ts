import { registerDecorator, type ValidationOptions } from 'class-validator';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_UTF8_BYTES = 72;
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const PASSWORD_VALIDATION_MESSAGE =
  'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.';

export function getPasswordUtf8ByteLength(value: string): number {
  return Buffer.byteLength(value, 'utf8');
}

export function isPasswordWithinBcryptLimit(value: string): boolean {
  return getPasswordUtf8ByteLength(value) <= PASSWORD_MAX_UTF8_BYTES;
}

export function getPasswordMaxBytesMessage(label = 'Şifre'): string {
  return `${label} güvenlik nedeniyle en fazla ${PASSWORD_MAX_UTF8_BYTES} UTF-8 bayt olabilir.`;
}

export function MaxPasswordUtf8Bytes(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'maxPasswordUtf8Bytes',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return true;
          }

          return isPasswordWithinBcryptLimit(value);
        },
        defaultMessage() {
          return getPasswordMaxBytesMessage();
        },
      },
    });
  };
}
