<template>
  <h1>
    Home
    <div v-if="equityHistoryData && !loading">
      <DashLineChart :data="equityHistoryData" />
    </div>

    <div v-if="equityHistoryData && !loading">
      <DashHorizontalBar :data="equityHistoryData" />
    </div>
    <div v-if="equityHistoryData && !loading">
      <DashHorizontalBar :data="equityHistoryData" />
    </div>
  </h1>
</template>

<script>
import { onMounted, ref } from 'vue';
import DashLineChart from '../../components/Charts/DashLineChart.vue';
import DashHorizontalBar from '../../components/Charts/DashHorizontalBar.vue';
import { api } from '../../services/api'

export default {
  components: {
    DashLineChart,
    DashHorizontalBar
  },
  setup() {
    const dashData = ref({})
    const loading = ref(false)
    const equityHistoryData = ref([])
    const clients_summary = ref([])
    const portfolioByBrokersData = ref([])
    const equityByBroker = ref([])

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      try {
        loading.value = true
        const response = await api.get('/d4a79840-93c0-4297-80bb-108c279377a3')

        dashData.value = response.data.data.clients_summary
        equityHistoryData.value = formatEquityHistoryData(response.data.data.advisor_summary.equity_history)
        clients_summary.value = response.data.data.clients_summary

        portfolioByBrokersData.value = formatchartsBrokersData(clients_summary.value, 'portfolio')
        equityByBroker.value = formatchartsBrokersData(clients_summary.value, 'equity')

        console.log('portfolioByBrokersData.value', portfolioByBrokersData.value)
        console.log('equityByBroker.value', equityByBroker.value)

      } catch (error) {
        console.log('error', error)

      } finally {
        loading.value = false
      }
    }

    const formatEquityHistoryData = (equityHistoryData) => {
      const labels = equityHistoryData.map(item => item.date)
      const values = equityHistoryData.map(item => {
        return Number((item.value / 1e6).toFixed(2));
      })

      return {
        labels,
        values
      }
    }

    const formatchartsBrokersData = (clients_summary, chart) => {
      const brokerA = clients_summary.filter(item => item.broker === 'A')
      const brokerB = clients_summary.filter(item => item.broker === 'B')
      const brokerC = clients_summary.filter(item => item.broker === 'C')

      if (chart === 'portfolio') {
        return {
          labels: ['C.A', 'C.B', 'C.C'],
          values: [brokerA.length, brokerB.length, brokerC.length]
        }
      }

      if (chart === 'equity') {
        return {
          labels: ['C.A', 'C.B', 'C.C'],
          values: [
            sumTransactions(brokerA),
            sumTransactions(brokerB),
            sumTransactions(brokerC),
          ]
        }
      }

      const sumTransactions = (broker) => {
        const sumBroker = broker.reduce((totalClient, client) => {
          const sumTransactions = client.latest_transactions.reduce((total, transaction) => total + transaction.value, 0);
          return totalClient + sumTransactions;
        }, 0);

        return sumBroker
      }
    }

    return {
      dashData,
      equityHistoryData,
      loading
    };
  },
};
</script>
