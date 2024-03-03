<template>
    <teleport to="body">
        <!-- overlay -->
        <div 
            class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-75"
            v-if="isActive"
            @click.self="closeModal"
        >

            <!-- content container -->
            <div 
                class="relative flex flex-col p-4 w-[90%] overflow-x-hidden bg-white h-fit min-h-[200px] max-h-[90%]" 
                :class="maxWidth"
                v-motion-slide-bottom
            >
                <button @click="closeModal">CLOSE</button>
                <slot />
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        maxWidth: {
            type: String,
            default: 'max-w-7xl'
        }
    },
    emits: ['closeModalClick'],
    setup(props, { emit }) {

        function closeModal() {
            emit('closeModalClick')
        }

        return {
            closeModal
        }
    },
}
</script>