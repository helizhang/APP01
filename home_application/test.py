# coding:utf-8
from django.http import HttpResponse
import base64
from common.mymako import render_mako_context, render_json
from esb_helper import execute_script_and_return, execute_job, get_job_instance_log
from common.log import logger
from settings import SITE_URL, BK_PAAS_HOST


def fast_execute_script_test(request):
    ip = "192.168.102.225"
    bk_cloud_id = 0
    ip_list = [{
        "bk_cloud_id": bk_cloud_id,
        "ip": ip
    }]
    biz_id = 2
    content = """
                #!/bin/bash
                MEMORY=$(free -m | awk 'NR==2{printf "%.2f%%", $3*100/$2 }')
                DISK=$(df -h | awk '$NF=="/"{printf "%s", $5}')
                CPU=$(top -bn1 | grep load | awk '{printf "%.2f%%", $(NF-2)}')
                DATE=$(date "+%Y-%m-%d %H:%M:%S")
                echo -e "$DATE|$MEMORY|$DISK|$CPU"
            """
    log_content = execute_script_and_return(request.user.username, ip_list, biz_id, content)
    return render_json(log_content)


# 执行作业
def execute_job_test(request):
    biz_id = 2
    bk_job_id = 7
    global_vars = [
                    {
                        "id": 38,
                        "ip_list": [
                            {
                                "bk_cloud_id": 0,
                                "ip": "192.168.102.225"
                            },
                            {
                                "bk_cloud_id": 0,
                                "ip": "192.168.102.226"
                            }
                        ]
                    }
                ]
    steps = [
            {
                "account": "root",
                "creator": "admin",
                "script_timeout": 1000,
                "script_content": base64.b64encode("#!/bin/bash\n\nhostname\n"),
                "ip_list": [
                    {
                        "ip": "192.168.102.226",
                        "bk_cloud_id": 0
                    }
                ],
                "step_id": 12,
                # "script_id": 11,
                "script_param": "",
                "script_type": 1
            }
        ]
    job_instance_id = execute_job(request.user.username, biz_id, bk_job_id, global_vars, steps, BK_PAAS_HOST+SITE_URL + 'job_call_back')
    ip_logs = get_job_instance_log(job_instance_id, biz_id)
    log_content = ip_logs[0]['log_content']
    return render_json(log_content)


# from account.decorators import login_exempt
# from django.views.decorators.csrf import csrf_exempt
#
# @login_exempt
# @csrf_exempt
def job_call_back(request):
    logger.info(request.body)
    return HttpResponse(200)
