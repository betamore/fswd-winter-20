/**
 * @jest-environment jsdom
 */

import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import TaskList from "./TaskList.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("Task vue component", function() {
    it("should render something", function() {
        const wrapper = mount(TaskList, {
            stubs: ["router-link", "router-view"],
            store: new Vuex.Store({
                state: {
                    tasks: [{ id: 1234, name: "Task name #1" }]
                }
            }),
            localVue
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
