# -*- coding: utf-8 -*-
from common.mymako import render_mako_context, render_json, render_mako_tostring
from blueking.component.shortcuts import get_client_by_request, get_client_by_user
from settings import SITE_URL
import base64
import json


# 获取业务列表
def get_app_list(request):
    client = get_client_by_request(request)
    params = {
        # "page": {
        #     "start": 0,
        #     "limit": 2
        # },
        'bk_username': 'admin',
        'fields': ['bk_biz_id', 'bk_biz_name']
    }
    res = client.cc.search_business(**params)
    if res.get('code') == 0:
        biz_list = res.get('data', '').get('info', [])
    else:
        biz_list = []
    return render_json({'result': True, 'data': biz_list})


# 获取主机列表
def get_host_list(request):
    # data_dict = json.loads(request.body)
    # biz_id = int(data_dict.get('biz_id'))
    biz_id = 2
    ip_list = ["192.168.102.225"]
    client = get_client_by_request(request)
    params = {
        'bk_username': 'admin',
        'bk_biz_id': biz_id,
        "condition": [
            {
                "bk_obj_id": "biz",
                "fields": [
                    "default",
                    "bk_biz_id",
                    "bk_biz_name",
                ]
            }
        ],
        "ip": {
            "data": ip_list,
            "exact": 0,
            "flag": "bk_host_innerip|bk_host_outerip"
        }
    }

    res = client.cc.search_host(**params)
    print res
    if res.get('code') == 0:
        data = res.get('data', '').get('info', [])
        print data
        host_list = [{
            'host_innerip': item.get('host').get('bk_host_innerip'),
            'bk_host_name': item.get('host').get('bk_host_name'),
            'bk_cloud_id': item.get('host').get('bk_cloud_id')[0].get('bk_inst_id'),
            'bk_cloud_name': item.get('host').get('bk_cloud_id')[0].get('bk_inst_name'),
            'bk_os_type': 'linux' if item.get('host').get('bk_os_type') == '1' else 'windows',
            'bk_biz_name': item.get('biz')[0].get('bk_biz_name'),
            # 'mem_usage': '--',
            # 'disk_usage': '--',
            # 'cpu_usage': '--',
            # 'is_monitored': True if Host.objects.filter(ip=item.get('host').get('bk_host_innerip')).exists() else False
        } for item in data]
        return render_json({'result': True, 'data': host_list})
    else:
        return render_json({'result': False})


# 执行脚本并返回结果
def execute_script_and_return(username, ip_list, biz_id, content):
    job_instance_id = fast_execute_script(username, ip_list, biz_id, content)
    if job_instance_id:
        ip_logs = get_job_instance_log(job_instance_id, biz_id)
        if ip_logs:
            log_content = ip_logs[0].get('log_content').strip('\n')
            return log_content
        else:
            return ""
    else:
        return ""


# 快速执行脚本
def fast_execute_script(username, ip_list, biz_id, content):
    client = get_client_by_user(username)

    params = {
        'bk_username': username,
        'bk_biz_id': int(biz_id),
        'script_content': base64.b64encode(content),
        'account': "root",
        'script_type': 1,
        'ip_list': ip_list,

    }
    resp = client.job.fast_execute_script(**params)
    print resp
    print resp.get('data')
    if resp.get('code') == 0:
        job_instance_id = resp.get('data').get('job_instance_id')
        return job_instance_id
    else:
        return False


# 查询作业日志
def get_job_instance_log(task_id, biz_id):
    client = get_client_by_user('admin')
    # 查询日志
    if get_job_instance_status(task_id, biz_id):
        resp = client.job.get_job_instance_log(job_instance_id=task_id,
                                               bk_biz_id=biz_id,
                                               bk_username='admin')
        print resp
        ip_logs = resp['data'][0]['step_results'][0]['ip_logs']
        return ip_logs

    else:
        return False


import time

count = 0


# 查询作业状态
def get_job_instance_status(task_id, biz_id):
    global count
    count += 1
    client = get_client_by_user('admin')
    # 查询执行状态
    resp = client.job.get_job_instance_status(bk_username='admin', bk_biz_id=biz_id, job_instance_id=task_id)
    print resp
    if resp.get('data').get('is_finished'):
        count = 0
        return True
    elif not resp.get('data').get('is_finished') and count <= 5:
        time.sleep(2)
        return get_job_instance_status(task_id, biz_id)
    else:
        count = 0
        return False


# 执行作业
def execute_job(username, biz_id, bk_job_id, global_vars, steps, bk_callback_url):
    client = get_client_by_user(username)
    print bk_callback_url
    params = {
        "bk_username": username,
        "bk_biz_id": biz_id,
        "bk_job_id": bk_job_id,
        "steps": steps,
        # "global_vars": global_vars,
        "bk_callback_url": bk_callback_url
    }
    result = client.job.execute_job(**params)
    print result
    if result.get('result'):
        job_instance_id = result.get('data').get('job_instance_id')
        return True, job_instance_id
    else:
        return False, result.get('message')
