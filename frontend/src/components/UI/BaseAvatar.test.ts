import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseAvatar from "./BaseAvatar.vue";

describe("BaseAvatar.vue", () => {
  it("renders image when src is provided", () => {
    const wrapper = mount(BaseAvatar, {
      props: {
        src: "https://example.com/avatar.jpg",
        alt: "User",
      },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/avatar.jpg");
    expect(img.attributes("alt")).toBe("User");
  });

  it("renders fallback text when src is not provided", () => {
    const wrapper = mount(BaseAvatar, {
      props: {
        text: "John Doe",
      },
    });
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.text()).toContain("JO");
  });

  it("renders empty fallback when neither src nor text is provided", () => {
    const wrapper = mount(BaseAvatar, {
      props: {},
    });
    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.text()).toBe("");
  });
});
