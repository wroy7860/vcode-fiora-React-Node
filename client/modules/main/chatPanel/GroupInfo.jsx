import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import autobind from 'autobind-decorator';

import Dialog from '@/components/Dialog';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import action from '@/state/action';
import fetch from 'utils/fetch';

class GroupInfo extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        groupInfo: PropTypes.object,
        onClose: PropTypes.func,
        groups: ImmutablePropTypes.list,
    }
    @autobind
    async handleJoinGroup() {
        const { groupInfo, onClose } = this.props;
        onClose();
        const [err, res] = await fetch('joinGroup', { groupId: groupInfo._id });
        if (!err) {
            action.addGroup(res);
        }
    }
    @autobind
    handleFocusGroup() {
        const { groupInfo, onClose } = this.props;
        onClose();
        action.setFocusGroup(groupInfo._id);
    }
    render() {
        const { visible, groupInfo, onClose, groups } = this.props;
        return (
            <Dialog className="group-info" visible={visible} onClose={onClose}>
                {
                    visible && groupInfo ?
                        <div className="content">
                            <div className="header">
                                <Avatar size={60} src={groupInfo.avatar} />
                                <p>{groupInfo.name}</p>
                            </div>
                            <div className="info">
                                <div>
                                    <p>成员:</p>
                                    <div>{groupInfo.members}人</div>
                                </div>
                                {
                                    groups.find(g => g.get('_id') === groupInfo._id) ?
                                        <Button onClick={this.handleFocusGroup}>发送消息</Button>
                                        :
                                        <Button onClick={this.handleJoinGroup}>加入群组</Button>
                                }
                            </div>
                        </div>
                        :
                        null
                }
            </Dialog>
        );
    }
}

export default connect(state => ({
    groups: state.getIn(['user', 'groups']),
}))(GroupInfo);
