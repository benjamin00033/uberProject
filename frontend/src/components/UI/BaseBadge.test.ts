import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseBadge from "./BaseBadge.vue";
import { IonBadge } from "@ionic/vue";

describe("BaseBadge.vue", () => {
  it("renders correctly with text prop", () => {
    const wrapper = mount(BaseBadge, {
      props: {
        text: "New",
      },
    });
    expect(wrapper.text()).toContain("New");
  });

  it("renders correctly with slot", () => {
    const wrapper = mount(BaseBadge, {
      slots: {
        default: "Slot Content",
      },
    });
    expect(wrapper.text()).toContain("Slot Content");
  });

  it("passes color prop to ion-badge", () => {
    const wrapper = mount(BaseBadge, {
      props: {
        color: "success",
      },
    });
    expect(wrapper.findComponent(IonBadge).props("color")).toBe("success");
  });
});
