import {AngularProject, NgConfigParser} from './ng-config-parser';

test('should read angular.json file and extract apps and tests', () => {
  const parser = new NgConfigParser();
  const projects = parser.parse(`${process.cwd()}/src/__mocks__`);
  expect(projects).toBeDefined();
  expect(Array.isArray(projects)).toBeTruthy();
  expect(projects.length).toBeGreaterThan(1);
  expect(projects[0]).toMatchObject({type: 'application', name: 'ngtest'} as AngularProject);
});
