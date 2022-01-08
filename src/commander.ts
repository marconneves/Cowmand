// /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// /* eslint-disable @typescript-eslint/ban-types */
// import chalk from 'chalk';
// // import { Options } from './parseArgumentsIntoOptions';
//
// type CommandExecution<T> = (params: string[], flags: T) => Promise<void | null>;
// type FlagExecution = () => Promise<void | null>;
//
// type CommandParams<T> = [string, CommandExecution<T>];
// type SubCommandParams<T> = [string, string, CommandExecution<T>];
//
// type FlagParams = [string, FlagExecution];
// type SubFlagParams = [string, string, FlagExecution];
//
// export type CommanderCLI<T> = {
//   command(...params: CommandParams<T> | SubCommandParams<T>): Promise<void>;
//   flag(...params: FlagParams | SubFlagParams): Promise<void>;
// };
//
// export function Commander(args: Options) {
//   const flag = async (...params: FlagParams | SubFlagParams) => {
//     try {
//       const [flagString, executionOrSubFlagOrCommandFlag, execution] = params;
//       if (
//         typeof executionOrSubFlagOrCommandFlag !== 'string' &&
//         typeof args.flags[flagString] === 'boolean'
//       ) {
//         if (!args.flags[flagString] || !!args.command) {
//           return;
//         }
//
//         await executionOrSubFlagOrCommandFlag();
//       } else if (execution) {
//         if (
//           !args.flags[flagString] ||
//           (executionOrSubFlagOrCommandFlag !== args.command &&
//             executionOrSubFlagOrCommandFlag !== args.flags[flagString] &&
//             args.flags[flagString] !== 'boolean')
//         ) {
//           return;
//         }
//
//         await execution();
//       } else {
//         return;
//       }
//
//       process.exit(1);
//     } catch (error) {
//       if (error instanceof Error) {
//         console.log(chalk.red.bold(error.message));
//       }
//
//       process.exit(0);
//     }
//   };
//
//   const command = async (
//     ...params:
//       | CommandParams<typeof args.flags>
//       | SubCommandParams<typeof args.flags>
//   ) => {
//     const [commandString, executionOrSubCommand, execution] = params;
//     if (typeof executionOrSubCommand !== 'string') {
//       if (commandString !== args.command || !!args.subCommand) {
//         return;
//       }
//
//       executionOrSubCommand(args.parameters || [], args.flags).catch(error => {
//         console.log(chalk.red.bold(error.message));
//         process.exit(0);
//       });
//     } else if (execution) {
//       if (
//         commandString !== args.command ||
//         executionOrSubCommand !== args.subCommand
//       ) {
//         return;
//       }
//
//       execution(args.parameters || [], args.flags).catch(error => {
//         console.log(chalk.red.bold(error.message));
//         process.exit(0);
//       });
//     } else {
//       return;
//     }
//     process.exit(1);
//   };
//
//   const functionsReturn: CommanderCLI<typeof args.flags> = {
//     command,
//     flag
//   };
//
//   return functionsReturn;
// }
