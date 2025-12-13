import { SignedOut, UserButton } from '@clerk/clerk-react';
import { LayoutDashboardIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignInOAuthButtons from './SignInOAuthButtons';
import { type ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

const Topbar = () => {
  const { isAdmin } = useAuthStore();

  const adminDashboard = isAdmin ? (
    <Link to={'/admin'} className={cn(buttonVariants({ variant: 'outline' }))}>
      <LayoutDashboardIcon className="size-5 mr-2" />
      Admin Dashboard
    </Link>
  ) : null;

  return <View adminDashboard={adminDashboard} />;
};

const View = ({ adminDashboard }: { adminDashboard: ReactNode }) => {
  return (
    <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className="flex gap-2 items-center">
        <img src="./logo.png" className="size-8" alt="Beatly logo" />
        Beatly
      </div>
      <div className="flex items-center gap-4">
        {adminDashboard}

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>
        <UserButton />
      </div>
    </div>
  );
};

export default Topbar;
