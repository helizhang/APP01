# -*- coding: utf-8 -*-

from django.conf.urls import patterns
from esb_helper import get_host_list

urlpatterns = patterns(
    'home_application.views',
    (r'^$', 'home'),
    (r'^get_pie_data$', 'get_pie_data'),
    (r'^get_line_data$', 'get_line_data'),
    (r'^get_table_data$', 'get_table_data'),
    (r'^get_bar_data', 'get_bar_data'),
    (r'^fast_execute_script_test', 'fast_execute_script_test'),
    (r'^execute_job_test$', 'execute_job_test'),
    (r'^job_call_back$', 'job_call_back'),

)
