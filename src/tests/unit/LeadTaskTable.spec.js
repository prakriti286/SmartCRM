import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import LeadTaskTable from '@/components/LeadTaskTable.vue'

describe('LeadTaskTable.vue', () => {
    let store
    let leadsModule
    let tasksModule

    const factory = (leads = [], tasks = []) => {
        leadsModule = {
            namespaced: true,
            state: { leads },
            actions: { fetchLeads: jest.fn() }
        }
        tasksModule = {
            namespaced: true,
            state: { tasks },
            actions: { fetchTasks: jest.fn() }
        }
        store = createStore({
            modules: {
                leads: leadsModule,
                tasks: tasksModule
            }
        })
        return mount(LeadTaskTable, {
            global: {
                plugins: [store]
            }
        })
    }

    it('renders table headers', () => {
        const wrapper = factory()
        const headers = wrapper.findAll('th').map(th => th.text())
        expect(headers).toEqual([
            'Name', 'Company', 'Task Title', 'Due Date', 'Task Status'
        ])
    })

    it('shows empty state when no data', () => {
        const wrapper = factory()
        expect(wrapper.text()).toContain('No data available')
    })

    it('renders combined data rows', () => {
        const leads = [
            { id: 1, name: 'Aman', company: 'zomato.' },
            { id: 2, name: 'Bitu', company: 'LLC' }
        ]
        const tasks = [
            { id: 101, leadId: 1, title: 'Call', dueDate: '2025-06-01', status: 'Pending' },
            { id: 102, leadId: 2, title: 'Email', dueDate: '2025-06-02', status: 'Done' }
        ]
        const wrapper = factory(leads, tasks)
        const rows = wrapper.findAll('tbody tr')
            
        expect(rows).toHaveLength(2)
        expect(rows[0].text()).toContain('Aman')
        expect(rows[0].text()).toContain('zomato')
        expect(rows[0].text()).toContain('Call')
        expect(rows[0].text()).toContain('2025-06-01')
        expect(rows[0].text()).toContain('Pending')
        expect(rows[1].text()).toContain('Bitu')
        expect(rows[1].text()).toContain('LLC')
        expect(rows[1].text()).toContain('Email')
        expect(rows[1].text()).toContain('2025-06-02')
        expect(rows[1].text()).toContain('Done')
    })

    it('shows Unknown for missing lead', () => {
        const leads = []
        const tasks = [
            { id: 201, leadId: 99, title: 'Task', dueDate: '2025-06-03', status: 'Closed' }
        ]
        const wrapper = factory(leads, tasks)
        const row = wrapper.find('tbody tr')
        expect(row.text()).toContain('Unknown')
        expect(row.text()).toContain('Task')
        expect(row.text()).toContain('Closed')
    })

    it('applies correct badge class for status', () => {
        const leads = [{ id: 1, name: 'Test', company: 'TestCo' }]
        const tasks = [
            { id: 1, leadId: 1, title: 'Task', dueDate: '2025-06-04', status: 'Done' },
            { id: 2, leadId: 1, title: 'Task', dueDate: '2025-06-05', status: 'Pending' },
            { id: 3, leadId: 1, title: 'Task', dueDate: '2025-06-06', status: 'In Progress' },
            { id: 4, leadId: 1, title: 'Task', dueDate: '2025-06-07', status: 'Closed' },
            { id: 5, leadId: 1, title: 'Task', dueDate: '2025-06-08', status: 'Other' }
        ]
        const wrapper = factory(leads, tasks)
        const badges = wrapper.findAll('.badge')
        expect(badges[0].classes()).toContain('badge-success')
        expect(badges[1].classes()).toContain('badge-warning')
        expect(badges[2].classes()).toContain('badge-info')
        expect(badges[3].classes()).toContain('badge-secondary')
        expect(badges[4].classes()).toContain('badge-light')
    })
})