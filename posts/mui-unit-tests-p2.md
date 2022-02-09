---
title: "Material UI unit tests - hands on"
date: "2022-02-08"
description: "No more fluff, let's write unit tests for the front-end using MUI, React and Testing Library"
tldr: "Scenarios -> Setup -> Interact -> Verify"
topics: "Testing, Jest, React"
---

This is the second of two hands-on posts about unit testing the front-end. This time we'll build on the principles from the [previous post](/posts/mui-unit-tests-p1) and write clean UI tests that make sense.

Kicking things off from where we left them, we tested that the Combo Box variation of the AutoComplete component would
- render an input field
- allow focus and typing on the text input

But the component is a lot more advanced than that. A good way to find out the capabilities if you didn't write the component yourself is the documentation. RTFM ring a bell? In order to write efficient unit tests we should break down different behaviours and test them in an orderly manner. If we've verified something in one test, there is no use of verifying the same thing in the next test. I've seen a lot of tests that `expect` the same things as previous ones so that is one thing we can stop doing now.

Also if we notice that each test starts the exact same way, maybe we should try to extract the code to avoid duplication as much as possible. Notice that the argument to render are the same six lines of code, so why not extract them into a const in the parent scope, turning this:

```JavaScript
describe("Combo box", () => {
  it("should render an input field", () => {
    const { container, getByLabelText, debug } = render(
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top10Films}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    );
    // omitted...
  })
  it("should allow focus and typing on the text input", () => {
    const { getByLabelText } = render(
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top10Films}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    );
    // omitted...
  })
})
```

Into this:


```JavaScript
describe("Combo box", () => {
  const comboBox = (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top10Films}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
  it("should render an input field", () => {
    const { container, getByLabelText, debug } = render(comboBox);
    // omitted...
  })
  it("should allow focus and typing on the text input", () => {
    const { getByLabelText } = render(comboBox);
    // omitted...
  })
})
```

If we have tests that need some setup to run _before each_ unit test, or _before all_ unit tests, we use the `beforeEach` or `beforeAll` method, and in the callback argument we specify what needs to be done. If we need to do clean-up there is the corresponding `afterEach` and `afterAll` methods.

```JavaScript
describe("Combo box", () => {
  beforeEach(() => {
    console.log("This will run before each and every test (it-statement) in the scope");
  });
  beforeAll(() => {
    console.log("This will run before all tests in the scope");
  });
  afterEach(() => {
    console.log("E.g. delete a test file if you've created during runs...");
  });
  afterAll(() => {
    console.log("...or reset the app state to initial state.");
  });
  // omitted...
})
```

Back to writing actual unit tests, what more scenarios can we think of? In this step, it's advisable to have the [component running somewhere](https://codesandbox.io/s/dujuv?file=/demo.js:0-32) and interact with it to get ideas into what is expected by the user, and what might go wrong unless we specifically test it. Let's jot some ideas down:

- show the list of movies on focus
- filter the list of movies according to the input
- ignore case when filtering
- let the user know if there were no matches

Straightforward enough, now let's try to write the tests. You can use debug statements to get a feel for what is rendered on the DOM and how to get a hold of (parts of) the elements you're testing.

```Javascript
it("should show the list of movies on focus", () => {
  const { getByLabelText, container } = render(comboBox);
  userEvent.click(getByLabelText("Movie"));

  expect(getAllByRole(container, "option").length).toBe(top10Films.length);
});
```

For this first test, we use the [getAllByRole](https://testing-library.com/docs/queries/byrole/) method to target every DOM element with the option role, since the AutoComplete component gives us a list of options on click. By asserting that the length matches a property of an object that is being rendered, the test doesn't have to be updated if the list is updated. I.e. `expect(options.length).toBe(10);` will pass now, but will also break if the list is changed.


Let's continue with the other test cases.


```Javascript
it("should filter the list of movies according to the input", () => {
  const { getByLabelText, container } = render(comboBox);
  // We skip the click/focus assertion since we already checked it
  userEvent.type(getByLabelText("Movie"), "The Godfather");
  const options = getAllByRole(container, "option");
  expect(options.length).toBe(2);
  options.forEach((o) => {
    expect(o.innerHTML).toContain("The Godfather");
  });
  // The Godfather part 1 and 2 have different names
  expect(options[0].innerHTML).not.toBe(options[1].innerHTML);
});
it("should ignore case when filtering", () => {
  const { getByLabelText, container } = render(comboBox);
  userEvent.type(getByLabelText("Movie"), "ThE GoDfAtHER");
  const options = getAllByRole(container, "option");
  expect(options.length).toBe(2);
  options.forEach((o) => {
    expect(o.innerHTML).toContain("The Godfather");
  });
});
it("should let the user know if there were no matches", () => {
  const { getByLabelText, container } = render(comboBox);
  userEvent.type(getByLabelText("Movie"), "Return of Darth Jar-Jar");
  expect(() => getAllByRole(container, "option")).toThrow(); // Wait what?
});
```

Nothing too crazy, the only thing to note is the last one. When looking at the docs for `getByRole` we could see that it throws an error if there are no matches. So expecting the length of options to be 0 is not going to work, since an error will be thrown. Instead, we expect that an error will be thrown. In Jest, we need to do this in a [callback function](https://jestjs.io/docs/expect#tothrowerror) in order for `toThrow` to work.


The AutoComplete component has another variant as well: the [Multiple Values](https://codesandbox.io/s/x8cvy?file=/demo.js) which displays each selected value as a MUI Chip. Let's try and test that since it's bound to have more corner cases! Again, what is reasonable to check here? How about the following:

- render the input containing a chip with the default value
- add a chip once a value from the list has been selected 
- remove a chip if clicked 
- remove all chips if clear button is clicked 


Easily translatable to it-statements, we get these tests:


```JavaScript
describe("Multiple Values", () => {
  const multipleValues = (
    <Autocomplete
      multiple
      id="tags-standard"
      options={top10Films}
      renderInput={(params) => <TextField {...params} variant="standard" label="Movies" placeholder="Favorites"/>}
    />
  );
  it("should render the input containing a chip with the default value", () => {
    const { getByText, getAllByRole } = render(multipleValues);
    // This is one way to do it, if you know what you're targeting
    expect(getByText(top10Films[0].label)).toBeVisible()
    // Better way to find multiple chips, but does not work!
    expect(getAllByRole("button").length).toBe(1)
  })
})
```

The test above will fail! Why? Because the chip is one button, but there is also a clear button in the component. This is visible if you add the debug statement before the expect statement fails. You'll get a printout of the DOM that looks something like this:

```HTML
<!-- first match -->
<div
  class="MuiButtonBase-root MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-deletable MuiChip-deletableColorDefault MuiChip-filledDefault MuiAutocomplete-tag MuiAutocomplete-tagSizeMedium css-1k430x0-MuiButtonBase-root-MuiChip-root"
  data-tag-index="0"
  role="button"
  tabindex="-1"><!-- children omitted --></div>
<!-- second match -->
<button
  aria-label="Open"
  class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-popupIndicator css-qzbt6i-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator"
  tabindex="-1"
  title="Open"
  type="button"><!-- children omitted --></button>
```

The Chip component is a `div` with the added role of a button. The div has an attribute which the other button does not called `data-tag-index`, lets use that for targeting our MUI Chips. So we need to create a filter for the `getAllByRole` method. The filter will take a chip in the form of a `HTMLElement` and return whether it has the `data-tag-index` attribute. With this filter predicate we can get our chips and nothing else now.

We've been using a utility called [userEvent](https://testing-library.com/docs/ecosystem-user-event/) throughout these posts, and as per official docs:

> user-event is a companion library for Testing Library that provides more advanced simulation of browser interactions than the built-in fireEvent method.

Note the different usage between e.g. `.click()`, `.type()`, and `.keyboard()`. The `keyboard` function let's us fire one-off keyboard events, whereas `type` accepts whole strings.

```Javascript
function hasTagIndex(chip: HTMLElement) { 
  return chip.getAttribute("data-tag-index") !== null;
};

it("should render the input containing a chip with the default value", () => {
  const { getByText, getAllByRole } = render(multipleValues);
  // Works now. Noice
  const chips = getAllByRole("button").filter(hasTagIndex);
  expect(chips.length).toBe(1);
});

it("should add a chip once a value from the list has been selected", () => {
  const { getAllByRole, getByLabelText } = render(multipleValues);
  
  userEvent.type(getByLabelText("Movies"), "The Godfather");
  userEvent.keyboard("{ArrowDown}");
  userEvent.keyboard("{enter}");
  const chips = getAllByRole("button").filter(hasTagIndex);
  expect(chips.length).toBe(2);
});
```

The implementation of remaining test cases cover nothing new and have been omitted from this post. They're available in the repo linked at the bottom of this post. If we run the test suite now using the terminal, we get the following output. Note the structure of the report, and how any english-speaking person can make sense of it.


```terminal
➜  unit-tests git:(main) ✗ npm t

> unit-tests@1.0.0 test
> jest

 PASS  mui-tests/Autocomplete.spec.tsx
  MUI AutoComplete
    Combo box
      ✓ should render an input field (140 ms)
      ✓ should allow focus and typing on the text input (582 ms)
      ✓ should show the list of movies on focus (139 ms)
      ✓ should filter the list of movies according to the input (446 ms)
      ✓ should ignore case when filtering (433 ms)
      ✓ should let the user know if there were no matches (638 ms)
    Multiple Values
      ✓ should render the input containing a chip with the default value (79 ms)
      ✓ should add a chip once a value from the list has been selected (430 ms)
      ✓ should remove a chip if clicked (411 ms)
      ✓ should remove all chips if clear button is clicked (424 ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        5.276 s
Ran all test suites.
```

From here, you should be able to 
1. come up with different scenarios (the "it-statements"),
2. set them up and interact with them,
3. verify that the end result is as expected.

The majority of unit tests won't be more complicated than this! You can find the source code for the tests in [this repository](https://github.com/MTjody/unit-tests). Good luck!
