/**
 * @jest-environment jsdom
 */

import { shallowMount, mount } from "@vue/test-utils";
import Task from "./Task.vue";

describe("Task vue component", function() {
    it("should render something", function() {
        const wrapper = shallowMount(Task, {
            propsData: { task: { id: 123, name: "Task Name" } },
            stubs: ["router-link", "router-view"]
        });
        expect(wrapper.text()).toBe("Task Name");
    });

    it("should show is completed", function() {
        const wrapper = shallowMount(Task, {
            propsData: { task: { id: 123, name: "Task Names" } },
            stubs: ["router-link", "router-view"]
        });
        expect(wrapper.text()).toBe("Task Names is completed");
    });

    it("should match the snapshot", function() {
        const wrapper = mount(Task, {
            propsData: { task: { id: 123, name: "Task Names" } },
            stubs: ["router-link", "router-view"]
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
