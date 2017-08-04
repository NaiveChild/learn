import React from 'react';

import {store} from '../../store';


require('../../../../module/renlifang/styles.less');

let result = require('../getrelation-address.json').data;

export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.state={
        }
    }

    componentDidMount() {
    }
    componentWillUpdate(){
    }
    render() {
        const data = this.props.data;
        var ths=[];
        _.map(data, (item,index) => {
            // console.log(item,index);

            ths.push(
                <th><span>{item.name}{item.cert}{item.birthdate}</span></th>
                // <th><span>{item.cert}</span></th>
                // <th><span>{item.birthdate}</span></th>
            )
        });

        var tds=[];
        _.map(result, (item,index) => {
            tds.push(
                <tr>
                    <td><span>{item.name}</span></td>
                    <td><span>{item.cert}</span></td>
                    <td><span>{item.birthdate}</span></td>
                </tr>
                
            )
        });
        return (
            <div className="clearfix" style={{padding:'1%'}}>
                <div className="ant-table ant-table-bordered">
                    <div className="ant-table-body">
                        <table id={"table"}>
                            <thead className="ant-table-thead">
                                <tr>
                                    {ths}
                                </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                                {tds}
                                <tr>
                                    <td>data</td>
                                    <td>data</td>
                                    <td>data</td>
                                </tr>
                            </tbody>
                        </table>
                     </div>
                </div>
                <ul className="ant-pagination ant-table-pagination">
                    <li title="上一页" className="ant-pagination-prev"><a></a></li>
                    <li title="1" className="ant-pagination-item ant-pagination-item-1 ant-pagination-item-active"><a>1</a></li>
                    <li title="2" className="ant-pagination-item ant-pagination-item-2"><a>2</a></li>
                    <li title="下一页" className="ant-pagination-next"><a></a></li>
                </ul>
            </div>
           
             
        )
    }
}

module.exports = Table;

 