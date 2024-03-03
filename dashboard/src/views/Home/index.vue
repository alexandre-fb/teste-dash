<template>
  <div>
    <h1>
      Home
    </h1>

    <div v-if="transactionsData && !loading">
      <TableTransactions :data="transactionsData" />
    </div>

    <div v-if="equityHistoryData && !loading">
      <DashLineChart :data="equityHistoryData" />
    </div>

    <div v-if="portfolioByBrokersData && !loading">
      <DashPortfolioHorizontalBar :data="portfolioByBrokersData" />
    </div>

    <div v-if="equityByBrokerData && !loading">
      <DashEquityHorizontalBar :data="equityByBrokerData" />
    </div>
  </div>

</template>

<script>
import { onMounted, ref } from 'vue';
import DashLineChart from '../../components/Charts/DashLineChart.vue';
import DashHorizontalBar from '../../components/Charts/DashHorizontalBar.vue';
import { api } from '../../services/api'
import DashEquityHorizontalBar from '../../components/Charts/DashEquityHorizontalBar.vue';
import DashPortfolioHorizontalBar from '../../components/Charts/DashPortfolioHorizontalBar.vue';
import TableTransactions from '../../components/Table/TableTransactions.vue';

export default {
  components: {
    DashLineChart,
    DashHorizontalBar,
    DashEquityHorizontalBar,
    DashPortfolioHorizontalBar,
    TableTransactions,
  },
  setup() {
    const dashData = ref({})
    const loading = ref(false)
    const equityHistoryData = ref([])
    const clientsSummary = ref([])
    const portfolioByBrokersData = ref([])
    const equityByBrokerData = ref([])
    const transactionsData = ref([])

    onMounted(() => {
      getData()
    })

    const getData = async () => {
      try {
        loading.value = true
        const response = await api.get('/d4a79840-93c0-4297-80bb-108c279377a3')

        dashData.value = response.data.data.clients_summary

        equityHistoryData.value = formatEquityHistoryData(response.data.data.advisor_summary.equity_history)
        clientsSummary.value = response.data.data.clients_summary

        // bar chart
        portfolioByBrokersData.value = formatchartsBrokersData(clientsSummary.value, 'portfolio')
        equityByBrokerData.value = formatchartsBrokersData(clientsSummary.value, 'equity')

        // table
        transactionsData.value = formatTableTransactionsData(clientsSummary.value)

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
          labels: ['C.C', 'C.B', 'C.A'],
          values: [
            brokerC.length,
            brokerB.length,
            brokerA.length,
          ]
        }
      }

      const sumTransactions = (broker) => {
        const sumBroker = broker.reduce((totalClient, client) => {
          const sumTransactions = client.latest_transactions.reduce((total, transaction) => total + transaction.value, 0);
          return totalClient + sumTransactions;
        }, 0);

        return Number((sumBroker / 1e6).toFixed(2));
      }

      if (chart === 'equity') {
        return {
          labels: ['C.C', 'C.B', 'C.A'],
          values: [
            sumTransactions(brokerC),
            sumTransactions(brokerB),
            sumTransactions(brokerA),
          ]
        }
      }
    }

    const formatTableTransactionsData = (clients_summary) => {
      console.log('clients_summary', clients_summary)

      let allTransitions = []

      clients_summary.forEach((client => {
        client.latest_transactions.forEach(transaction => {
          allTransitions.push({
            name: client.name,
            date: transaction.date,
            value: transaction.value,
            type: transaction.type
          })
        })
      }))

      allTransitions.sort((a, b) => new Date(b.date) - new Date(a.date));

      return allTransitions
    }

    return {
      dashData,
      equityHistoryData,
      equityByBrokerData,
      portfolioByBrokersData,
      transactionsData,
      loading
    };
  },
};
</script>
