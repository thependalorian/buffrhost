/**
 * Validation Schemas Tests
 *
 * Comprehensive test suite for Zod validation schemas to ensure
 * proper data validation, sanitization, and error handling.
 *
 * Location: lib/validation/__tests__/schemas.test.ts
 * Purpose: Validate schema functionality and error responses
 * Coverage: Schema validation, type inference, error formatting
 */

import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  uuidSchema,
  registerSchema,
  loginSchema,
  createBookingSchema,
  updateBookingSchema,
  createPropertySchema,
  waitlistSignupSchema,
  validateData,
  safeValidateData,
  createValidationErrorResponse,
  type RegisterInput,
  type WaitlistSignupInput,
} from '../schemas';

describe('Validation Schemas', () => {
  describe('Common Schemas', () => {
    describe('emailSchema', () => {
      it('should validate valid email addresses', () => {
        const validEmails = [
          'user@example.com',
          'test.email+tag@domain.co.uk',
          'user_name@subdomain.domain.com'
        ];

        validEmails.forEach(email => {
          const result = emailSchema.safeParse(email);
          expect(result.success).toBe(true);
          expect(result.data).toBe(email.toLowerCase().trim());
        });
      });

      it('should reject invalid email addresses', () => {
        const invalidEmails = [
          'invalid-email',
          '@example.com',
          'user@',
          'user@.com',
          'user..double@example.com'
        ];

        invalidEmails.forEach(email => {
          const result = emailSchema.safeParse(email);
          expect(result.success).toBe(false);
        });
      });

      it('should transform email to lowercase and trim whitespace', () => {
        const result = emailSchema.safeParse('  user@example.com  ');
        expect(result.success).toBe(true);
        expect(result.data).toBe('user@example.com');
      });
    });

    describe('passwordSchema', () => {
      it('should validate strong passwords', () => {
        const strongPasswords = [
          'MySecurePass123!',
          'Complex@2024#Password',
          'Valid1Password!'
        ];

        strongPasswords.forEach(password => {
          const result = passwordSchema.safeParse(password);
          expect(result.success).toBe(true);
        });
      });

      it('should reject weak passwords', () => {
        const weakPasswords = [
          'short', // too short
          'nouppercase123!', // no uppercase
          'NOLOWERCASE123!', // no lowercase
          'NoNumbers!', // no numbers
          'NoSpecial123' // no special characters
        ];

        weakPasswords.forEach(password => {
          const result = passwordSchema.safeParse(password);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('phoneSchema', () => {
      it('should validate phone numbers', () => {
        const validPhones = [
          '+1234567890',
          '+447911123456',
          '123456789012345'
        ];

        validPhones.forEach(phone => {
          const result = phoneSchema.safeParse(phone);
          expect(result.success).toBe(true);
        });
      });

      it('should reject invalid phone numbers', () => {
        const invalidPhones = [
          'abc123',
          '+',
          '123', // too short
          '123456789012345678901234567890' // too long
        ];

        invalidPhones.forEach(phone => {
          const result = phoneSchema.safeParse(phone);
          expect(result.success).toBe(false);
        });
      });
    });

    describe('uuidSchema', () => {
      it('should validate UUIDs', () => {
        const validUUID = '550e8400-e29b-41d4-a716-446655440000';
        const result = uuidSchema.safeParse(validUUID);
        expect(result.success).toBe(true);
        expect(result.data).toBe(validUUID);
      });

      it('should reject invalid UUIDs', () => {
        const invalidUUIDs = [
          'not-a-uuid',
          '550e8400-e29b-41d4-a716', // too short
          '550e8400-e29b-41d4-a716-446655440000-extra' // too long
        ];

        invalidUUIDs.forEach(uuid => {
          const result = uuidSchema.safeParse(uuid);
          expect(result.success).toBe(false);
        });
      });
    });
  });

  describe('Authentication Schemas', () => {
    describe('registerSchema', () => {
      it('should validate complete registration data', () => {
        const validData = {
          email: 'user@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890'
        };

        const result = registerSchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data).toEqual(validData);
      });

      it('should reject registration with invalid email', () => {
        const invalidData = {
          email: 'invalid-email',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        };

        const result = registerSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toContain('email');
      });

      it('should make phone optional', () => {
        const dataWithoutPhone = {
          email: 'user@example.com',
          password: 'SecurePass123!',
          firstName: 'John',
          lastName: 'Doe'
        };

        const result = registerSchema.safeParse(dataWithoutPhone);
        expect(result.success).toBe(true);
      });
    });

    describe('loginSchema', () => {
      it('should validate login credentials', () => {
        const validData = {
          email: 'user@example.com',
          password: 'password123'
        };

        const result = loginSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Booking Schemas', () => {
    describe('createBookingSchema', () => {
      it('should validate complete booking data', () => {
        const validBooking = {
          propertyId: '550e8400-e29b-41d4-a716-446655440000',
          roomId: '550e8400-e29b-41d4-a716-446655440001',
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
          guestPhone: '+1234567890',
          checkInDate: '2024-12-25T00:00:00.000Z',
          checkOutDate: '2024-12-27T00:00:00.000Z',
          numberOfGuests: 2,
          specialRequests: 'Late check-in requested'
        };

        const result = createBookingSchema.safeParse(validBooking);
        expect(result.success).toBe(true);
      });

      it('should reject booking with checkout before checkin', () => {
        const invalidBooking = {
          propertyId: '550e8400-e29b-41d4-a716-446655440000',
          roomId: '550e8400-e29b-41d4-a716-446655440001',
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
          checkInDate: '2024-12-27T00:00:00.000Z',
          checkOutDate: '2024-12-25T00:00:00.000Z', // Before check-in
          numberOfGuests: 2
        };

        const result = createBookingSchema.safeParse(invalidBooking);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toContain('checkOutDate');
      });
    });
  });

  describe('Property Schemas', () => {
    describe('createPropertySchema', () => {
      it('should validate property creation data', () => {
        const validProperty = {
          name: 'Luxury Hotel',
          description: 'A premium hotel experience',
          address: '123 Main St, City, Country',
          city: 'City',
          country: 'Country',
          amenities: ['wifi', 'pool', 'spa']
        };

        const result = createPropertySchema.safeParse(validProperty);
        expect(result.success).toBe(true);
      });

      it('should enforce required fields', () => {
        const invalidProperty = {
          description: 'Missing required fields'
        };

        const result = createPropertySchema.safeParse(invalidProperty);
        expect(result.success).toBe(false);
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true);
      });
    });
  });

  describe('Waitlist Schemas', () => {
    describe('waitlistSignupSchema', () => {
      it('should validate minimal waitlist signup', () => {
        const minimalSignup = {
          email: 'user@example.com'
        };

        const result = waitlistSignupSchema.safeParse(minimalSignup);
        expect(result.success).toBe(true);
        expect(result.data.email).toBe('user@example.com');
      });

      it('should validate complete waitlist signup', () => {
        const completeSignup = {
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          company: 'ABC Corp',
          role: 'Manager',
          phone: '+1234567890',
          propertyType: 'hotel',
          expectedGuests: 100,
          referralSource: 'Google Search',
          specialRequirements: 'Integration with existing PMS needed'
        };

        const result = waitlistSignupSchema.safeParse(completeSignup);
        expect(result.success).toBe(true);
      });

      it('should validate enum values', () => {
        const invalidSignup = {
          email: 'user@example.com',
          propertyType: 'invalid-type'
        };

        const result = waitlistSignupSchema.safeParse(invalidSignup);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Utility Functions', () => {
    describe('validateData', () => {
      it('should validate and return data on success', () => {
        const data = 'user@example.com';
        const result = validateData(emailSchema, data);
        expect(result).toBe('user@example.com');
      });

      it('should throw error on validation failure', () => {
        const data = 'invalid-email';
        expect(() => validateData(emailSchema, data)).toThrow();
      });
    });

    describe('safeValidateData', () => {
      it('should return success result for valid data', () => {
        const data = 'user@example.com';
        const result = safeValidateData(emailSchema, data);
        expect(result.success).toBe(true);
        expect(result.data).toBe('user@example.com');
      });

      it('should return error result for invalid data', () => {
        const data = 'invalid-email';
        const result = safeValidateData(emailSchema, data);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    describe('createValidationErrorResponse', () => {
      it('should format validation errors properly', () => {
        const mockError = {
          errors: [
            {
              path: ['email'],
              message: 'Invalid email',
              code: 'invalid_string' as const
            }
          ]
        } as any;

        const response = createValidationErrorResponse(mockError);
        expect(response.success).toBe(false);
        expect(response.error).toBe('Validation failed');
        expect(response.details).toHaveLength(1);
        expect(response.details[0]).toEqual({
          field: 'email',
          message: 'Invalid email',
          code: 'invalid_string'
        });
      });
    });
  });

  describe('Type Inference', () => {
    it('should correctly infer RegisterInput type', () => {
      const data: RegisterInput = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      expect(data.email).toBe('user@example.com');
      expect(data.password).toBe('SecurePass123!');
    });

    it('should correctly infer WaitlistSignupInput type', () => {
      const data: WaitlistSignupInput = {
        email: 'user@example.com',
        firstName: 'John',
        propertyType: 'hotel'
      };

      expect(data.email).toBe('user@example.com');
      expect(data.firstName).toBe('John');
      expect(data.propertyType).toBe('hotel');
    });
  });
});
