<template>
    <section>
    <b-dropdown v-model="isPublic" aria-role="list">
        <template v-if="isPublic" #trigger>
            <b-button
                label="Public"
                type="is-primary"
                icon-left="earth"
                icon-right="menu-down"
            />
        </template>

        <template v-else #trigger>
            <b-button
                label="Friends"
                type="is-primary"
                icon-left="account-multiple"
                icon-right="menu-down"
            />
        </template>

        <b-dropdown-item :value="true" icon="earth" aria-role="listitem">
            <h3>Public</h3>
            <small>Everyone can see</small>
        </b-dropdown-item>

        <b-dropdown-item :value="false" icon="account-multiple" aria-role="listitem">
            <h3>Friends</h3>
            <small>Only friends can see</small>
        </b-dropdown-item>
    </b-dropdown>
</section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BButton, BDropdown, BDropdownItem, BIcon } from "buefy";

export default defineComponent({
    components: {
        BButton,
        BDropdown,
        BDropdownItem,
        BIcon,
    },
    data() {
        return {
            isPublic: true,
        };
    },
});
</script>
