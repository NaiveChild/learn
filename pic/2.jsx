import React from 'react';

import { Affix, Button } from 'antd';
import {store} from '../store';
import AutoLink from '.././rlf-auto-link';
import IconSet from '.././rlf-icon-set';


require('../../../module/renlifang/styles.less');
let QQdata = require('./getqq.json').data;

export default class RelationQQ extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var treeContainer = $('#relation-qq-container');
        treeContainer.fancytree({
            extensions: ["filter"],
            quicksearch: true,
            filter: {
                mode: "dimn",
                autoApply: true,
                highlight: true
            },
            selectmode: 1,
            clickFolderMode: 1,
            checkbox: false,
//             source: [ { "title": " QQ群组1", "key": "1" ,"folder": true,"children": [
// 　　　　　　　　　　　　　　　　{ "title": "周小姐", "key": "3" },
// 　　　　　　　　　　　　　　　　{ "title": "孙小姐", "key": "4" }
// 　　　　　　　　]},
// 　　　　　　　　{"title": "QQ群组2","key": "2","folder": true,"children": [
// 　　　　　　　　　　　　　　　　{ "title": "李先生", "key": "3" },
// 　　　　　　　　　　　　　　　　{ "title": "王先生", "key": "4" }
// 　　　　　　　　]}
// 　　　　　　　],
            source:QQdata,
            autoScroll: true,
            iconClass: function(event, data) {
                if (data.node.extraClasses) {
                    if (data.node.extraClasses.indexOf('nv-qq') != -1) {
                        return "fa fa-qq text-info";
                    } else if (data.node.extraClasses.indexOf('nv-group') != -1) {
                        return "fa fa-group text-info";
                    }
                }
                return "none";
            },
            postProcess: function(event, data) {
              console.log(data);
                if (data.response.data) {
                    data.result = data.response.data;
                }
            },
            // init: function(event, data) {
            //     data.tree.visit(function(node) {
            //         if (node.extraClasses == 'nv-qq') {
            //             node.setExpanded(true);
            //         }
            //         if (node.folder) {
            //             if (node.extraClasses != 'nv-qq') {
            //                 $('.fancytree-title:contains(' + node.title + ')').siblings('.fancytree-expander').attr('id', 'testId-' + node.title);
            //             } else {
            //                 $('.fancytree-title:contains(' + node.title + ')').siblings('.fancytree-expander').attr('id', 'testId-QQ号码');
            //             }

            //         }
            //     })

            // },
            activate: function(event, data) {
                if (data.node.extraClasses && data.node.extraClasses.indexOf('nv-group-item') != -1) {
                    _renderQQGroupDetail(data.node.data.number);
                }
            },
            expand: function(event, data) {
                    if (data.node.extraClasses == 'nv-qq-contact') {
                        data.node.visit(function(node) {
                            if (node.folder) {
                                $('.fancytree-title:contains(' + node.title + ')').siblings('.fancytree-expander').attr('id', 'testId-' + node.title);
                            }

                        })
                    }
                }
        })
        // fancytree 过滤
        var tree = treeContainer.fancytree("getTree");

        $("input[name=search]").keyup(function(e) {
            e.preventDefault();
            var n;
            var opts = {
                autoExpand: true
            };
            var match = $(this).val();

            if (e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
                $("button#btnResetSearch").click();
                return;
            }
            n = tree.filterNodes(match, opts);

            $("button#btnResetSearch").attr("disabled", false);
            $("span#matches").text("(" + n + ")");
        });

        $("button#btnResetSearch").click(function(e) {
            $("input[name=search]").val("");
            $("span#matches").text("");
            tree.clearFilter();
            tree.reload();
            $(this).attr("disabled", true);
        });

        function _renderQQGroupDetail(groupNumber){
            var detailContainer = $('#relation-qqgroup-detail');
            detailContainer.show();
            showLoader();
            $.getJSON("/renlifang/personcore/getqqgroup", {
                    number: groupNumber
                }, function(rsp) {
                    hideLoader();
                    if (rsp.code == 0) {
                        var groupDetail=rsp.data;
                        // groupDetail = _.pick(groupDetail, function(value, key) {
                        //     return (_.isNumber(value) && value != 0) || !_.isEmpty(value);
                        // })
                        // groupDetail = _.extend({
                        //     number: '-',
                        //     owners: ['-'],
                        //     description: '-',
                        //     createTime: '-'
                        // }, groupDetail);
                        store.dispatch({
                            type: 'GET_QQGROUPDETAIL',
                            qqgroupDetail: groupDetail
                       });
                       // if(rsp.data==""){
                       //      $(".qqgroupnodata").show();
                       // }
                       // else{
                       //     $(".qqgroup").show();
                       // }
                       $('#relation-qqgroup-tree').fancytree({
                          selectmode: 1,
                          clickFolderMode: 1,
                          checkbox: false,
                          autoScroll: true,
                          source: function() {
                              _.each(groupDetail.members, function(item) {
                                  item.title = item.nick + " (" + item.qq + ")";
                              });
                              return [{
                                  title: "群成员 (" + groupDetail.count + ")",
                                  children: groupDetail.members
                              }];
                          },
                          iconClass: function(event, data) {
                              return "fa fa-qq text-info";
                          },
                          renderNode: function(event, data) {
                              var a = $(data.node.li).find('.rlf-auto-link');
                              var currentHrefName = IconSet.getcurrentHrefName();
                              AutoLink.initLink(a, currentHrefName, '/renlifang/profile.html?entityid=' + (data&&data.node&&data.node.data&&data.node.data.qq? BASE64.encoder(data.node.data.qq) : '') + "&entitytype=" + ( data&&data.node&&data.node.data&&(data.node.data.valueType!=undefined)? BASE64.encoder('' + data.node.data.valueType) : ''));
                          }
                         
                      });
                 }
            });
        }

    }

    render() {
        const {name,number,createTime,description,owners}=store.getState().qqgroupDetail;
        var ownergroup;
        if(!_.isEmpty(owners)){
           (owners.length==1)?ownergroup=owners.join():ownergroup=owners.join(",");
        }
        console.log(store.getState().qqgroupDetail);
        return (
           <div id={"relation-qq"}  className="tab-pane  active in relation-qq" >
                <div style={{height: 560}} >
                    <div className="p10 col-xs-6">
                        <div className="row">
                            <div className="col-xs-8">
                                <input className="form-control" name="search" placeholder="过滤..."/>
                            </div>
                            <div className="col-xs-4">
                                <button type="button" className="btn btn-primary" id={"btnResetSearch"}>清除
                                    <span id={"matches"}></span>
                                </button>
                            </div>
                        </div>
                        <div className="p10 col-xs-12" id={"relation-qq-container"} style={{height: '100%'}}></div>
                    </div>
                    <div className="col-xs-6"   id={"relation-qqgroup-detail"} style={{paddingLeft:'20px',borderLeft:'1px solid #DDD',height:'100%', display:'none'}} >
                       <div className="p5 qqgroup">
                          <h4>{name}</h4>
                          <br/>
                          <div>
                              <label className="field-label">群信息</label>
                              <p className="default-text">
                                  <span>群号:</span><span className="text-info ml10">{number}</span>
                                  <br/>
                                  <span>创建时间:</span><span className="text-info ml10">{createTime}</span>
                                  <br/>
                                  <span>群主:</span><span className="text-info ml10">{ownergroup}</span>
                                  <br/>
                                  <span>描述:</span><span className="text-info ml10">{description}</span>
                              </p>
                          </div>
                      </div>
                      <div className="p5 qqgroupnodata">
                          <label class="field-label">群成员</label>
                          <div className="qq-group mt10" id="relation-qqgroup-tree"></div>
                      </div> 
                    </div>
                </div>
            </div>

        )
    }
}

module.exports = RelationQQ;