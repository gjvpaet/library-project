import React, { Component } from 'react';

import Layout from '../../components/Layout/index.jsx';

class Dashboard extends Component {
    render() {
        let userData = JSON.parse(localStorage.getItem('userData'));

        return (
            <Layout title="Dashboard" userName={`${userData.FirstName} ${userData.LastName}`}>
                <p>dsdfs</p>
            </Layout>
        );
    }
}

export default Dashboard;