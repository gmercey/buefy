import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import BMessage from '@components/message/Message.vue'
import { beforeEach, describe, expect, it } from 'vitest'

let wrapper: VueWrapper<InstanceType<typeof BMessage>>

describe('BMessage', () => {
    beforeEach(() => {
        wrapper = shallowMount(BMessage)
    })

    it('is called', () => {
        expect(wrapper.vm).toBeTruthy()
        expect(wrapper.vm.$options.name).toBe('BMessage')
    })

    it('render correctly', () => {
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('custom header contains html element', () => {
        wrapper = shallowMount(BMessage, {
            slots: {
                header: 'Custom header with <a>link</a>'
            }
        })
        expect(wrapper.find('a').exists()).toBeTruthy()
    })

    describe('click event handling', () => {
        it('should allow native click events to pass through to parent', async () => {
            const clickHandler = vi.fn()

            wrapper = shallowMount(BMessage, {
                attrs: {
                    onClick: clickHandler
                },
                slots: {
                    default: 'Test message content'
                }
            })

            // Click on the message article element
            const article = wrapper.find('article.message')
            await article.trigger('click')

            // The click handler should be called since BMessage no longer blocks click events
            expect(clickHandler).toHaveBeenCalledTimes(1)
        })

        it('should not emit click events itself (unlike BNotification)', () => {
            wrapper = shallowMount(BMessage, {
                slots: {
                    default: 'Test message content'
                }
            })

            // BMessage should not have click in its emits
            expect(wrapper.vm.$options.emits).not.toHaveProperty('click')
        })

        it('should still emit close and update:modelValue events', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    closable: true,
                    title: 'Test title' // Need title or header slot for delete button to appear
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
