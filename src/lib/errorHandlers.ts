import { authService } from '../services/authService';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authService.getCurrentUser()?.uid,
      email: authService.getCurrentUser()?.email,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  
  console.error('Firestore Protocol Failure:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
