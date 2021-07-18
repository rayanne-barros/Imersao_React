import nookies from 'nookies';

export default function Logout() {
    return <div>Logout</div>
}

export async function getServerSideProps(context) {
    await nookies.destroy(context, 'USER_TOKEN')
    return {
        redirect: {
          destination: '/login',
          permanent: false,
        }
      }
}