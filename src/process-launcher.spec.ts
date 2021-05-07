import {ProcessLauncher} from './process-launcher';

test('should launch child process and display stdout log', done => {
  ProcessLauncher.launch('node', ['-v'], {
    stdout: out => {
      expect(out).toBeDefined();
      done();
    },
  });
});

test('should launch child process and display stderr log', done => {
  ProcessLauncher.launch('find', ['.'], {
    stderr: out => {
      expect(out).toBeDefined();
      done();
    },
  });
});
