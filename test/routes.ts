import { Route, DefaultProps } from '../src/main/render.interface';

interface CustomProps extends DefaultProps {
  userId: number;
}

export const isEmpty = (obj: any): boolean => (Object as any).entries(obj).length === 0
  && obj.constructor === Object;

export const routes: Route[] = [
  {
    path: '**',
    component: (props) => {
      props.onSendMessage('Sorry I did not get that');
    },
  },
  {
    path: '/menu',
    component: (props) => {
      props.onSendMessage('Hi there! \nHow can I help you today? :)');
    },
  },
  {
    path: '/signup',
    component: prop => {
      if (prop.text === 'cancel') {
        prop.history.unlock();
        prop.history.setState({});
      }

      if (isEmpty(prop.history.getState())) {
        prop.history.lock();
        prop.onSendMessage('Please enter your username');

        prop.history.setState({
          step: 'REQUEST_USERNAME',
          username: null,
          emailAddress: null,
        });

        return;
      }

      if (prop.history.getState().step === 'REQUEST_USERNAME') {
        // validate
        prop.history.setState({
          ...prop.history.getState(),
          step: 'REQUEST_EMAIL',
          username: prop.text,
        });

        prop.onSendMessage('Please enter your email address');

        return;
      }

      if (prop.history.getState().step === 'REQUEST_EMAIL') {
        // validate
        
        prop.history.setState({
          ...prop.history.getState(),
          emailAddress: prop.text,
        });

        const { username, emailAddress } = prop.history.getState();

        prop.history.unlock();
        prop.history.setState({});

        prop.onSendMessage(`Hi username: ${username} email: ${emailAddress}`);

        return;
      }
    },
  },
  {
    path: '/login',
    alias: '/signin',
    models: [
      /(\blogin\b)/i,
      /(\blog\b)[\w\-\s]+(\bin\b)/i,
    ],
    component: async (props) => {
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
  {
    path: '/home',
    middleware: (props) => {
      if (!props.userId) {
        props.onSendMessage('Not allowed');
        return false;
      }

      return true;
    },
    component: (props: CustomProps) => {
      props.onSendMessage('Welcome home :)', {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [
            ['1 Check your account balance'],
            ['2 Withdraw money to your M-PESA account'],
            ['3 Deposit from your M-PESA account'],
            ['4 Request account statement'],
            ['5 Request loan'],
            ['6 Pay loan'],
            ['7 Check loan limit'],
            ['8 Check current loan status'],
            ['9 Check profile information'],
            ['10 Log out of your account'],
            ['11 Frequently Asked Questions (FAQ)'],
          ],
        },
      });
    },
  },
  {
    path: '/bypass',
    component: (props) => {
      props.render('/home', { userId: 123 });
    },
  },
];
