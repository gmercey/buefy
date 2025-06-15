import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import BNotification from '@components/notification/Notification.vue'

let wrapper: VueWrapper<InstanceType<typeof BNotification>>

describe('BNotification', () => {
    beforeEach(() => {
        wrapper = shallowMount(BNotification)
    })

    it('is called', () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.$options.name).toBe('BNotification')
    })

    it('render correctly', () => {
        expect(wrapper.html()).toMatchSnapshot()
    })

    describe('click event handling', () => {
        it('should emit click events when clicked', async () => {
            wrapper = shallowMount(BNotification, {
                props: {
                    message: 'Test notification'
                }
            })

            // Click on the notification article element
            const article = wrapper.find('article.notification')
            await article.trigger('click')

            // Should emit click event
            expect(wrapper.emitted()).toHaveProperty('click')
            expect(wrapper.emitted().click).toHaveLength(1)
        })

        it('should have click in its emits configuration', () => {
            wrapper = shallowMount(BNotification)

            // BNotification should have click in its emits
            expect(wrapper.vm.$options.emits).toHaveProperty('click')
        })

        it('should still emit close and update:modelValue events', async () => {
            wrapper = shallowMount(BNotification, {
                props: {
                    closable: true,
                    message: 'Test notification'
                }
            })

            // Click the close button
            const deleteButton = wrapper.find('.delete')
            await deleteButton.trigger('click')

            // Should emit the close events
            expect(wrapper.emitted()).toHaveProperty('close')
            expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        })
    })
})
