import { describe, expect, test } from 'vitest';

import { HomePage } from '~/pages/home/Page';
import { Matcher, render, RenderResult } from '~/tests/render';
import { RoutesProps, setupRoutes } from '~/tests/setupRoutes';

describe.skip(HomePage.name, () => {
  test('should render org name', async () => {
    const page = HomePageObject.render({ initialEntries: ['/'] });

    expect(await page.findByText(/Welcome to PDG/i)).toBeTruthy();
  });
});

class HomePageObject {
  private readonly pageElement: RenderResult;

  constructor(pageElement: RenderResult) {
    this.pageElement = pageElement;
  }
  static render(props?: RoutesProps) {
    const Routes = setupRoutes([
      {
        path: '/',
        Component: HomePage,
      },
    ]);

    const container = render(<Routes {...props} />);

    return new HomePageObject(container);
  }

  async findByText(matcher: Matcher) {
    return this.pageElement.findByText(matcher);
  }
}
