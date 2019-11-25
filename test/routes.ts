import { Route, DefaultProps } from '../src/main/render.interface';

interface CustomProps extends DefaultProps{
  userId: number;
}

export const routes: Route[] = [
  {
    path: '**',
    component: (props) => {
      props.onSendMessage('Sorry I did not get that');
    },
  },
  {
    path: '/menu',
    component: (props: CustomProps) => {
      props.onSendMessage('Hi there! \nHow can I help you today? :)');
    },
  },
  {
    path: '/home',
    middleware: (props) => {
      if (!props.userId) {
        props.onSendMessage('Not allowed');
        return false;
      }

      return true;
    },
    component: (props) => {
      props.onSendMessage('Welcome home :)');
    },
  },
  {
    path: '/signin',
    component: (props) => {
      props.render('login', { userId: 123 });
    },
  },
  {
    path: '/login',
    alias: '/signin',
    models: [
      /(\blogin\b)/i,
      /(\blog\b)[\w\-\s]+(\bin\b)/i,
    ],
    component: async (props: CustomProps) => {
      const login = (): Promise<string> => new Promise((resolve) => {
        setTimeout(() => {
          resolve('Logged in successfully :)');
        }, 1000);
      });

      props.onSendMessage('Logging you in...');

      const msg = await login();
      props.onSendMessage(msg);
    },
  },
];
