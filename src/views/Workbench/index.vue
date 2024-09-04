<script>
import { getIndustryAPI } from '@/api/user';
export default {
    created() {
        this.getIndustry()
    },
    methods: {
        async getIndustry(){
            const res = await getIndustryAPI()
            // console.log(res)
        }
    }
}
</script>

<template>
  <div class="databoard-container">
    工作台
  </div>
</template>

<style scoped lang="scss">

</style>
