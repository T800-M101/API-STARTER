import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { LogoutResponseDto } from 'src/modules/auth/dto/logout.dto';
import { SignUpDto } from 'src/modules/users/dto/signup.dto';
import { UserProfileDto } from 'src/modules/users/dto/user-profile.dto';

/**
 * Decorator for the Sign-Up operation.
 * Applies validation pipes, defines the OpenAPI operation summary,
 * sets the request body based on RegisterDto, and documents standard responses.
 */
export function ApiSignUp() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new account',
      description: 'Creates a user profile.',
    }),
    ApiBody({ type: SignUpDto }),
    ApiCreatedResponse({ description: 'User successfully created.' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
    ApiConflictResponse({ description: 'Email or username already exists.' }),
  );
}

/**
 * Decorator for the Login operation.
 * Validates request body, documents the login operation,
 * and specifies success/error response codes.
 */
export function ApiLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Authenticates user and returns JWT tokens.',
    }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({ description: 'Login successful.' }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials.' }),
  );
}

/**
 * Decorator for the Refresh Token operation.
 * Documents the refresh process and indicates that JWT Bearer authentication is required.
 */
export function ApiRefresh() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh Token',
      description: 'Issues new tokens.',
    }),
    ApiBearerAuth('access-token'), // Estandariza el nombre aquí
    ApiOkResponse({ description: 'Tokens refreshed successfully.' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
  );
}

/**
 * Decorator for the Logout operation.
 * Documents the logout process which invalidates the current session.
 */
export function ApiLogout() {
  return applyDecorators(
    ApiOperation({
      summary: 'Logout user',
      description: 'Invalidates the current session.',
    }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Successfully logged out.',
      type: LogoutResponseDto,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
    ApiNotFoundResponse({ description: 'User not found.' }),
  );
}

/**
 * Decorator for the Get Profile operation.
 * Documents the endpoint that returns the current user's profile information.
 */
export function ApiProfile() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current user profile' }),
    ApiBearerAuth('access-token'),
    ApiOkResponse({
      description: 'Profile retrieved successfully.',
      type: UserProfileDto,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
  );
}

/**
 * Decorator for the Create Admin operation.
 * Documents the endpoint used to create a new administrative user.
 * It requires JWT authentication and enforces an 'ADMIN' role check.
 */
export function ApiCreateAdmin() {
  return applyDecorators(
    ApiOperation({ summary: 'Create Admin User (Admin Only)' }),
    ApiBearerAuth('access-token'),
    ApiCreatedResponse({ description: 'Admin successfully created.' }),
    ApiForbiddenResponse({ description: 'Forbidden (Requires ADMIN role).' }),
    ApiBadRequestResponse({ description: 'Validation failed.' }),
  );
}
