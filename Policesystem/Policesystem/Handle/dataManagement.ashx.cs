using DbComponent;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;

namespace Policesystem.Handle
{
    /// <summary>
    /// dataManagement 的摘要说明
    /// </summary>
    public class dataManagement : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string search = context.Request.Form["search"];
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string hbbegintime = context.Request.Form["hbbegintime"];
            string hbendtime = context.Request.Form["hbendtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string requesttype = context.Request.Form["requesttype"];
            int dates  = int.Parse(context.Request.Form["dates"]);
            StringBuilder sqltext = new StringBuilder();
            search = (search=="") ? " " : "  and (de.[DevId] like '%" + search + "%' or us.[XM] like '%" + search + "%' or us.[JYBH] like '%" + search + "%' ) ";
            switch (type)
            {
                case "5":
                    if (ssdd == "all")
            {   //设备配发
                sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where [Time] >='" + begintime+ "' and   [Time] <='" + endtime + "'  and de.DevType = " + type + search + "  UNION ALL ");
                //使用时长
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where [Time] >='" + begintime + "' and  [Time] <='" + endtime + "' and de.DevType = " + type + search + " UNION ALL ");
                //设备使用数量
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE [Time] >='" + begintime + "' and  [Time] <='" + endtime + "' and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                //设备在线数量
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE [Time] >='" + begintime + "' and  [Time] <='" + endtime + "' and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
    
                //同比上周设备配发
                sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + "  UNION ALL ");
                //同比上周使用时长
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " UNION ALL ");
                //同比上周设备使用数量
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                //同比上周设备在线数量
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "' and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                goto end;
            }
            if (sszd == "all")
            {
                sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' or BMDM='"+ ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and [Time] >='" + begintime + "' and  [Time] <='" + endtime + "' and de.DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                goto end;
            }

                sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd+"' and [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  [Time] >='" + begintime + "' and  [Time] <='" + endtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + "  UNION ALL ");
                sqltext.Append("SELECT sum(VideLength) as [Value] from EveryDayInfo_ZFJLY as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[VideLength]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [EveryDayInfo_ZFJLY]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  [Time] >='" + hbbegintime + "' and  [Time] <='" + hbendtime + "'  and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[VideLength]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                goto end;

       
                default:
                    if (ssdd == "all")
                    {   //设备配发
                        sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType <> 6 and de.DevType = " + type + search + "  UNION ALL ");
                        //使用时长
                        sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                        //设备使用数量
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                        //设备在线数量
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");

                        //同比上周设备配发
                        sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType <> 6 and de.DevType = " + type + search + "  UNION ALL ");
                        //同比上周使用时长
                        sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                        //同比上周设备使用数量
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                        //同比上周设备在线数量
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                        goto end;
                    }
                    if (sszd == "all")
                    {
                        sqltext.Append("WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' or BMDM='" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType<> 6 and de.DevType = " + type + search + "  UNION ALL ");
                        sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                        sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType <> 6 and de.DevType = " + type + search + "  UNION ALL ");
                        sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                        sqltext.Append("select sum(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE  Entity in (SELECT BMDM from childtable) and AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                        goto end;
                    }

                    sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType <> 6 and de.DevType = " + type + search + "  UNION ALL ");
                    sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                    sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                    sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo] as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  AlarmDay >='" + begintime + "' and  AlarmDay <='" + endtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                    sqltext.Append("SELECT COUNT(DISTINCT a.DevId) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType <> 6 and de.DevType = " + type + search + "  UNION ALL ");
                    sqltext.Append("SELECT sum(value) as [Value] from Alarm_EveryDayInfo as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH where Entity ='" + sszd + "' and  AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and AlarmType = 1 and de.DevType = " + type + search + " UNION ALL ");
                    sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 600*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b  UNION ALL ");
                    sqltext.Append("select COUNT(b.sz) as value from (SELECT  (CASE WHEN sum(a.[Value]) > 1800*" + dates + " THEN 1 ELSE 0 END) AS sz FROM [Alarm_EveryDayInfo]  as  a left join [Device] as de on  de.[DevId] = a.[DevId]  left join ACL_USER as us on de.JYBH = us.JYBH WHERE Entity ='" + sszd + "' and  AlarmDay >='" + hbbegintime + "' and  AlarmDay <='" + hbendtime + "' and a.AlarmType = 1 and de.DevType = " + type + search + " GROUP BY a.DevId having (CASE WHEN sum(a.[Value]) > 1000 THEN 1 ELSE 0 END)=1 ) as b ");
                    goto end;

            }


        end:;

     
                   
         
                    DataTable dt = SQLHelper.ExecuteRead(CommandType.Text, sqltext.ToString(), "DB");
            context.Response.Write(JSON.DatatableToJson(dt, ""));

        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}