/**
 * @jest-environment jsdom
 */

import { shallowMount, mount } from "@vue/test-utils";
import Base from "./Base.vue";

describe("Base vue component", function() {
    it("should render something", function() {
        const wrapper = shallowMount(Base);
        expect(wrapper.text()).toBe("This is Base");
    });

    it("should make the snapshot", function() {
        const wrapper = mount(Base);
        expect(wrapper.element).toMatchSnapshot();
    });
});
