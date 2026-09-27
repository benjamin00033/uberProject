import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseEmptyState from "./BaseEmptyState.vue";

describe("BaseEmptyState.vue", () => {
  it("renders title and description", () => {
    const wrapper = mount(BaseEmptyState, {
      props: {
        title: "No Data",
        description: "There is no data to display.",
      },
    });
    expect(wrapper.text()).toContain("No Data");
    expect(wrapper.text()).toContain("There is no data to display.");
  });

  it("renders action slot", () => {
    const wrapper = mount(BaseEmptyState, {
      slots: {
        action: "<button>Click Me</button>",
      },
    });
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.find("button").text()).toBe("Click Me");
  });
});
