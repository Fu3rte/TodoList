interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return <div style={{ color: 'red' }}>{message}</div>;
}
