import { shallowMount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import BMessage from '@components/message/Message.vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

    describe('props and styling', () => {
        it('should apply type and size classes to the article element', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    type: 'is-success',
                    size: 'is-large'
                }
            })

            const article = wrapper.find('article.message')
            expect(article.classes()).toContain('is-success')
            expect(article.classes()).toContain('is-large')
        })

        it('should show/hide based on modelValue prop', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    modelValue: false
                }
            })

            const article = wrapper.find('article.message')
            expect(article.attributes('style')).toContain('display: none')

            await wrapper.setProps({ modelValue: true })
            expect(article.attributes('style')).not.toContain('display: none')
        })

        it('should set aria-label on close button', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    title: 'Test',
                    closable: true,
                    ariaCloseLabel: 'Custom close label'
                }
            })

            const closeButton = wrapper.find('.delete')
            expect(closeButton.attributes('aria-label')).toBe('Custom close label')
        })

        it('should not show close button when closable is false', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    title: 'Test',
                    closable: false
                }
            })

            expect(wrapper.find('.delete').exists()).toBe(false)
        })
    })

    describe('header rendering', () => {
        it('should render title when title prop is provided', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    title: 'Test Title'
                }
            })

            expect(wrapper.find('.message-header p').text()).toBe('Test Title')
        })

        it('should prioritize header slot over title prop', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    title: 'Title Prop'
                },
                slots: {
                    header: '<span>Header Slot</span>'
                }
            })

            expect(wrapper.find('.message-header span').exists()).toBe(true)
            expect(wrapper.find('.message-header p').exists()).toBe(false)
        })

        it('should not render header when neither title nor header slot is provided', () => {
            wrapper = shallowMount(BMessage)
            expect(wrapper.find('.message-header').exists()).toBe(false)
        })
    })

    describe('icon rendering', () => {
        it('should show icon when hasIcon is true and computedIcon is available', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    hasIcon: true,
                    type: 'is-success'
                },
                slots: {
                    default: 'Message content'
                }
            })

            const icon = wrapper.findComponent({ name: 'BIcon' })
            expect(icon.exists()).toBe(true)
            expect(icon.props('icon')).toBe('check-circle')
        })

        it('should use custom icon when provided', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    hasIcon: true,
                    icon: 'custom-icon'
                },
                slots: {
                    default: 'Message content'
                }
            })

            const icon = wrapper.findComponent({ name: 'BIcon' })
            expect(icon.props('icon')).toBe('custom-icon')
        })

        it('should not show icon when hasIcon is false', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    hasIcon: false,
                    type: 'is-success'
                },
                slots: {
                    default: 'Message content'
                }
            })

            expect(wrapper.findComponent({ name: 'BIcon' }).exists()).toBe(false)
        })

        it('should apply correct icon props', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    hasIcon: true,
                    type: 'is-warning',
                    iconPack: 'custom-pack',
                    iconSize: 'is-medium'
                },
                slots: {
                    default: 'Message content'
                }
            })

            const icon = wrapper.findComponent({ name: 'BIcon' })
            expect(icon.props()).toMatchObject({
                icon: 'alert',
                pack: 'custom-pack',
                size: 'is-medium',
                both: true
            })
            expect(icon.classes()).toContain('is-warning')
        })
    })

    describe('computed icon logic', () => {
        const iconTestCases = [
            { type: 'is-info', expectedIcon: 'information' },
            { type: 'is-success', expectedIcon: 'check-circle' },
            { type: 'is-warning', expectedIcon: 'alert' },
            { type: 'is-danger', expectedIcon: 'alert-circle' },
            { type: 'unknown', expectedIcon: null }
        ]

        iconTestCases.forEach(({ type, expectedIcon }) => {
            it(`should return ${expectedIcon} for type ${type}`, () => {
                wrapper = shallowMount(BMessage, {
                    props: { type }
                })

                expect(wrapper.vm.computedIcon).toBe(expectedIcon)
            })
        })

        it('should prioritize custom icon over type-based icon', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    type: 'is-success',
                    icon: 'custom-icon'
                }
            })

            expect(wrapper.vm.computedIcon).toBe('custom-icon')
        })
    })

    describe('message body rendering', () => {
        it('should render message body when default slot is provided', () => {
            wrapper = shallowMount(BMessage, {
                slots: {
                    default: 'Message content'
                }
            })

            expect(wrapper.find('.message-body').exists()).toBe(true)
            expect(wrapper.find('.media-content').text()).toBe('Message content')
        })

        it('should not render message body when no default slot is provided', () => {
            wrapper = shallowMount(BMessage)
            expect(wrapper.find('.message-body').exists()).toBe(false)
        })
    })

    describe('progress bar', () => {
        it('should show progress bar when progressBar prop is true', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    progressBar: true,
                    duration: 3000
                }
            })

            const progressBar = wrapper.findComponent({ name: 'BProgress' })
            expect(progressBar.exists()).toBe(true)
            expect(progressBar.props()).toMatchObject({
                value: 2, // remainingTime - 1 = 3 - 1 = 2
                max: 2, // duration / 1000 - 1 = 3000 / 1000 - 1 = 2
                rounded: false
            })
        })

        it('should not show progress bar when progressBar prop is false', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    progressBar: false
                }
            })

            expect(wrapper.findComponent({ name: 'BProgress' }).exists()).toBe(false)
        })

        it('should apply type class to progress bar', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    progressBar: true,
                    type: 'is-success'
                }
            })

            const progressBar = wrapper.findComponent({ name: 'BProgress' })
            expect(progressBar.props('type')).toBe('is-success')
        })
    })

    describe('auto close functionality', () => {
        beforeEach(() => {
            vi.useFakeTimers()
        })

        afterEach(() => {
            vi.useRealTimers()
        })

        it('should auto close after duration when autoClose is true', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    autoClose: true,
                    duration: 1000
                }
            })

            expect(wrapper.vm.isActive).toBe(true)

            // Fast-forward time
            vi.advanceTimersByTime(1000)

            await wrapper.vm.$nextTick()
            expect(wrapper.vm.isActive).toBe(false)
            expect(wrapper.emitted()).toHaveProperty('close')
            expect(wrapper.emitted()).toHaveProperty('update:modelValue')
        })

        it('should not auto close when autoClose is false', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    autoClose: false,
                    duration: 1000
                }
            })

            expect(wrapper.vm.isActive).toBe(true)

            vi.advanceTimersByTime(1000)
            await wrapper.vm.$nextTick()

            expect(wrapper.vm.isActive).toBe(true)
            expect(wrapper.emitted()).not.toHaveProperty('close')
        })

        it('should clear timer when isActive becomes false', async () => {
            const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

            wrapper = shallowMount(BMessage, {
                props: {
                    autoClose: true,
                    duration: 1000,
                    modelValue: true
                }
            })

            // Verify timer is set
            expect(wrapper.vm.timer).toBeDefined()

            // Set isActive to false (simulating close)
            await wrapper.setProps({ modelValue: false })

            // Timer should be cleared when isActive becomes false
            expect(clearTimeoutSpy).toHaveBeenCalledWith(wrapper.vm.timer)
        })
    })

    describe('modelValue reactivity', () => {
        it('should update isActive when modelValue changes', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    modelValue: true
                }
            })

            expect(wrapper.vm.isActive).toBe(true)

            await wrapper.setProps({ modelValue: false })
            expect(wrapper.vm.isActive).toBe(false)

            await wrapper.setProps({ modelValue: true })
            expect(wrapper.vm.isActive).toBe(true)
        })

        it('should emit update:modelValue when closed', async () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    title: 'Test',
                    modelValue: true
                }
            })

            const closeButton = wrapper.find('.delete')
            await closeButton.trigger('click')

            expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
            expect(wrapper.emitted()['update:modelValue'][0]).toEqual([false])
        })
    })

    describe('icon size computation', () => {
        it('should use iconSize prop when provided', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    iconSize: 'is-small'
                }
            })

            expect(wrapper.vm.newIconSize).toBe('is-small')
        })

        it('should fallback to size prop when iconSize is not provided', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    size: 'is-medium'
                }
            })

            expect(wrapper.vm.newIconSize).toBe('is-medium')
        })

        it('should fallback to "is-large" when neither iconSize nor size is provided', () => {
            wrapper = shallowMount(BMessage)
            expect(wrapper.vm.newIconSize).toBe('is-large')
        })

        it('should prioritize iconSize over size prop', () => {
            wrapper = shallowMount(BMessage, {
                props: {
                    iconSize: 'is-small',
                    size: 'is-large'
                }
            })

            expect(wrapper.vm.newIconSize).toBe('is-small')
        })
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
