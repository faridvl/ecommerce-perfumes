import { unauthorizeServerSidePage } from '@/hocs/auth';
import { LoginContainer } from '@/components/containers/login/login-container';

const LoginPage = () => <LoginContainer />;

export const getServerSideProps = unauthorizeServerSidePage();
export default LoginPage;
