import { describe, expect, test } from 'vitest';

import { SignInPage } from '~/pages/auth/signin/Page';
import { Matcher, render, RenderResult } from '~/tests/render';
import { RoutesProps, setupRoutes } from '~/tests/setupRoutes';

describe(SignInPage.name, () => {
  test('should render sign in page', async () => {
    const page = HomePageObject.render({ initialEntries: ['/signIn'] });

    expect(await page.findByText(/Sign in to account/i)).toBeTruthy();
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
        path: '/signIn',
        Component: SignInPage,
      },
    ]);

    const container = render(<Routes {...props} />);

    return new HomePageObject(container);
  }

  async findByText(matcher: Matcher) {
    return this.pageElement.findByText(matcher);
  }
}
