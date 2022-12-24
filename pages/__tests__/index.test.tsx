import Home from "../index";
import renderer from "react-test-renderer";

describe("Home", () => {
  it("renders", () => {
    const tree = renderer.create(
      <Home
        clientId={process.env.APP_CLIENTID}
        clientSecret={process.env.APP_CLIENTSECRET}
        redirectUri={process.env.APP_REDIRECTURI}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it("log in to spotify button works", () => {
    const tree = renderer.create(
      <Home
        clientId={process.env.APP_CLIENTID}
        clientSecret={process.env.APP_CLIENTSECRET}
        redirectUri={process.env.APP_REDIRECTURI}
      />
    );

    const button = tree.root.findByType("a");
    expect(button.props.href).toBe(
      `https://accounts.spotify.com/authorize?client_id=${process.env.APP_CLIENTID}&response_type=code&redirect_uri=${process.env.APP_REDIRECTURI}&scope=user-top-read`
    );
  });
});
