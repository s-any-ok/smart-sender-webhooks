import { Button } from 'src/shared/ui';

import { useLogout } from '../model/useLogout';

export const LogoutButton = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      variant="ghost"
      loading={isPending}
      onClick={() => logout()}
    >
      Вийти
    </Button>
  );
};
