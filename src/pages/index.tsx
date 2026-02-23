import { GetServerSideProps } from 'next';
import { routesPublic } from '@/shared/navigation/routes';

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: routesPublic.catalog,
            permanent: false,
        },
    };
};

const IndexPage = () => null;

export default IndexPage;