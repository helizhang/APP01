# -*- coding: utf-8 -*-
from django.http import HttpResponse
from common.mymako import render_mako_context, render_json
from esb_helper import execute_script_and_return, execute_job, get_job_instance_log
from common.log import logger
import base64
from settings import SITE_URL, BK_PAAS_HOST

def home(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/js_factory.html')


# 饼图
def get_pie_data(request):
    return render_json({'result': True, 'data': [{"y": 6, "name": u"剩余"}, {"y": 4, "name": u"已用"}], 'pie_title': u"饼图"})


# 折线图
def get_line_data(request):
    return render_json({
        'result': True,
        'data': [{'categories': [1, 2], 'taskList': [{'data': [2, 3], 'name': 'load'}]}]
    })


# 表格
def get_table_data(request):
    return render_json({'result': True, 'data': [[1, 2, 3], [1, 2, 3]], 'headers': [u'a', u'b', u'c']})


# 柱状图
def get_bar_data(request):
    return render_json({'result': True, 'data': [
        {"name": 'Windows服务器', "data": [1]},
        {"name": 'AD服务器', "data": [2], "color": "#4cb5b0"},
        {"name": 'TEST服务器', "data": [1]}
    ]})



