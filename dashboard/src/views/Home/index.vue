<template>
  <h1>
    Home
    <div v-if="equityHistoryData && !loading">
      <DashLineChart :data="equityHistoryData" />
    </div>
  </h1>
</template>

<script>
import { onMounted, ref } from 'vue';
import DashLineChart from '../../components/Charts/DashLineChart.vue';
import { api } from '../../services/api'

export default {
  components: {
    DashLineChart
  },
  setup() {
    const dashData = ref({})
    const loading = ref(false)
    const equityHistoryData = ref([])

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      try {
        loading.value = true
        const response = await api.get('/d4a79840-93c0-4297-80bb-108c279377a3')

        dashData.value = response.data.data
        equityHistoryData.value = formatEquityHistoryData(response.data.data.advisor_summary.equity_history)

      } catch (error) {
        console.log('error', error)

      } finally {
        loading.value = false
      }
    }

    const formatEquityHistoryData = (equityHistoryData) => {
      console.log('equityHistoryData', equityHistoryData)

      const labels = equityHistoryData.map(item => item.date)
      const values = equityHistoryData.map(item => {
        return Number((item.value / 1e6).toFixed(2));
      })

      return {
        labels,
        values
      }
      console.log('labevaluels', values)
    }

    return {
      dashData,
      equityHistoryData,
      loading
    };
  },
};
</script>
