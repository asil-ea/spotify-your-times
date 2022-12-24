import renderer from "react-test-renderer";
import { TopYearsAndTheirTracksContext } from "../TopYearsAndTheirTracksContext";

describe("TopYearsAndTheirTracksContext", () => {
  it("initializes the context properly", () => {
    expect(TopYearsAndTheirTracksContext).toBeDefined();
    expect(TopYearsAndTheirTracksContext.Provider).toBeDefined();
    expect(TopYearsAndTheirTracksContext.Consumer).toBeDefined();
  });

  it("takes value as a prop", () => {
    const value = { TopYearsAndTheirTracks: {thisIs: "a track"}, setTopYearsAndTheirTracks: jest.fn() };
    const tree = renderer.create(
      <>
      <TopYearsAndTheirTracksContext.Provider value={value}>
        <div />
        <p>{value.TopYearsAndTheirTracks.thisIs}</p>
      </TopYearsAndTheirTracksContext.Provider>
      </>
    );;
    expect(tree.root.findByType('p').children).not.toBeNull();
  });
});
