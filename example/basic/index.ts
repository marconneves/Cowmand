import Cowmand from '../../src/cowmand';
import { GuardLogin } from './guardLogin';
import { LoginController } from './loginController';
import { MeController } from './meController';

const program = Cowmand();

program.use({ notIn: ['login'] }, GuardLogin);

program.use('login', LoginController);

program.use('me', MeController);

// console.log(program.stack);

program.start();
// Example of stack
// const commands = {
//   handle(req, res, next) {
//     return {
//       stack: [
//         {
//           path: 'me',
//           type: 'command',
//           handle() {
//             console.log('Is me route');
//           }
//         },
//         {
//           path: 'list',
//           type: 'command',
//           handle() {
//             console.log('List users');
//           }
//         }
//       ]
//     };
//   }
// };
//
// const oi = {
//   path: '',
//   stack: [
//     {
//       path: '',
//       notInPath: ['login'],
//       type: 'middleware',
//       handle() {
//         console.log('Verify is logged, auth');
//       }
//     },
//     {
//       path: 'login',
//       notInPath: [],
//       type: 'middleware',
//       handle() {
//         console.log('Helper to login');
//       }
//     },
//     {
//       path: 'login',
//       type: 'command',
//       handle() {
//         console.log('middleware 2');
//       }
//     },
//     {
//       path: '',
//       type: 'Commands',
//       handle() {
//         commands.handle('req', 'res', 'next');
//       }
//     }
//   ]
// };
