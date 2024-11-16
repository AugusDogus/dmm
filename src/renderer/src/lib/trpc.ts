import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from 'src/main/api';

export const trpc = createTRPCReact<AppRouter>();
