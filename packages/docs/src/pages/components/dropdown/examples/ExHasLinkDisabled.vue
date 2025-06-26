<template>
    <section>
        <nav class="navbar">
            <div class="navbar-brand">
                <a class="navbar-item">
                    <img src="/static/img/buefy-logo.png" alt="Buefy" />
                </a>
                <a class="navbar-item"><b-icon pack="fab" icon="github"></b-icon></a>
                <a class="navbar-item"><b-icon pack="fab" icon="twitter"></b-icon></a>
            </div>
            
            <div class="navbar-menu">
                <div class="navbar-end">
                    <b-dropdown
                        v-model="navigation"
                        position="is-bottom-left"
                        append-to-body
                        aria-role="menu"
                    >
                        <template #trigger>
                            <a class="navbar-item" role="button">
                                <span>Menu</span>
                                <b-icon icon="menu-down"></b-icon>
                            </a>
                        </template>

                        <b-dropdown-item custom aria-role="menuitem">
                            Logged as <b>Rafael Beraldo</b>
                        </b-dropdown-item>
                        <hr class="dropdown-divider" />
                        <b-dropdown-item icon="link" has-link aria-role="menuitem">
                            <a href="https://google.com" target="_blank" rel="noopener noreferrer" class="is-flex is-align-items-center is-gap-1">
                                Google (link)
                            </a>
                        </b-dropdown-item>
                        <b-dropdown-item value="home" icon="home" label="Home" aria-role="menuitem" />
                        <b-dropdown-item value="products" icon="cart" label="Products" aria-role="menuitem" />
                        <b-dropdown-item value="blog" icon="book-open" label="Blog" disabled aria-role="menuitem" />
                        <hr class="dropdown-divider" aria-role="menuitem" />
                        <b-dropdown-item value="settings" icon="cog" label="Settings" />
                        <b-dropdown-item value="logout" icon="logout" label="Logout" aria-role="menuitem" />
                    </b-dropdown>
                </div>
            </div>
        </nav>
    </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BDropdown, BDropdownItem, BIcon } from "buefy";

export default defineComponent({
    components: {
        BDropdown,
        BDropdownItem,
        BIcon,
    },
    data() {
        return {
            navigation: "home",
        };
    },
});
</script>
