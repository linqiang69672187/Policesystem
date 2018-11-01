using DbComponent;
using GemBox.Spreadsheet;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Web;


namespace Policesystem.Handle
{
    /// <summary>
    /// getDataManagement 的摘要说明
    /// </summary>
    public class getDataManagement : IHttpHandler
    {


        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string type = context.Request.Form["type"];
            string begintime = context.Request.Form["begintime"];
            string endtime = context.Request.Form["endtime"];
            string hbbegintime = context.Request.Form["hbbegintime"];
            string hbendtime = context.Request.Form["hbendtime"];
            string ssdd = context.Request.Form["ssdd"];
            string sszd = context.Request.Form["sszd"];
            string requesttype = context.Request.Form["requesttype"];
            string search = context.Request.Form["search"];
            string sreachcondi = "";

            int onlinevalue = int.Parse(context.Request.Form["onlinevalue"])*60;
            int usedvalue= int.Parse(context.Request.Form["usedvalue"]) * 60;


            if (search != "")
            {
                sreachcondi = " (de.[DevId] like '%" + search + "%' or us.[XM] like '%" + search + "%' or us.[JYBH] like '%" + search + "%' ) and ";
            }

            string tmpDevid = "";
            int tmpRows = 0;
            DataTable dtEntity = null;  //单位信息表
            //typetext: typetext, ssddtext: ssddtext, sszdtext: sszdtext,
            // endtime = "2017/9/14"; //测试使用
            string title = "";
            if (context.Request.Form["ssddtext"] == "全部")
            {
                title = "台州交警局";
            }
            else
            {
                title = context.Request.Form["ssddtext"];
            }

            if (context.Request.Form["sszdtext"] != "全部")
            {
                title += context.Request.Form["sszdtext"];
            }



            StringBuilder sqltext = new StringBuilder();

            DataTable dtreturns = new DataTable(); //返回数据表
            dtreturns.Columns.Add("cloum1");
            dtreturns.Columns.Add("cloum2");
            dtreturns.Columns.Add("cloum3");
            dtreturns.Columns.Add("cloum4");
            dtreturns.Columns.Add("cloum5");
            dtreturns.Columns.Add("cloum6", typeof(double));
            dtreturns.Columns.Add("cloum7", typeof(double));
            dtreturns.Columns.Add("cloum8");
            dtreturns.Columns.Add("cloum9");
            dtreturns.Columns.Add("cloum10");
            dtreturns.Columns.Add("cloum11");
            dtreturns.Columns.Add("cloum12");
            dtreturns.Columns.Add("cloum13", typeof(int));
            dtreturns.Columns.Add("cloum14");
        


            int days = Convert.ToInt16(context.Request.Form["dates"]);
            int statusvalue = 10;  //正常参考值
            int zxstatusvalue = 30;//在线参考值
            int devicescount = 0;  //汇总设备总数
            double zxsc = 0.0;  //汇总在线时长
            double spdx = 0.0;  //汇总视频大小
            Int64 cxl = 0;  //汇总查询量
            int hzusecount = 0;
            int wcxl = 0;   //无查询量设备数量
            int wcfl = 0;   //无处罚量设备数量
            int wsysb = 0;  //无使用设备数量
            int zxsb = 0; //在线设备
            string pxstring = "";
            string bmdm = ""; //汇总的部门代码
            int allstatu_device = 0;  //汇总使用率不为空数量
            string ddtitle;//大队标题


            statusvalue = days * usedvalue;//超过10分钟算使用
            zxstatusvalue = days * onlinevalue;//在线参考值
            DataTable Alarm_EveryDayInfo = null; //每日告警
            DataTable dUser = null;



            //所有大队
            if (ssdd == "all")
            {
                bmdm = "331000000000";
                ddtitle = "台州交警局";

                switch (type)
                {
                    case "5":
                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM, en.SJBM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType],ala.文件大小 from (SELECT [DevId],sum([VideLength]) as 在线时长,sum([FileSize]) as 文件大小,1 as AlarmType from [EveryDayInfo_ZFJLY]   where  [Time] >='" + begintime + "' and [Time] <='" + endtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where "+ sreachcondi + " de.[DevType]=" + type, "Alarm_EveryDayInfo");
                        dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM as ID,BMJC as Name,SJBM as ParentID,BMJB AS Depth from [Entity] a where [SJBM]  = '331000000000' and [BMJC] IS NOT NULL AND BMJC <> '' ORDER BY Sort", "2");
                        break;
                    default:
                        Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM, en.SJBM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType],0 as 文件大小 from (SELECT [DevId],[AlarmType],sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <>6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where " + sreachcondi + " de.[DevType]=" + type, "Alarm_EveryDayInfo");
                        dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM as ID,BMJC as Name,SJBM as ParentID,BMJB AS Depth from [Entity] a where [SJBM]  = '331000000000' and [BMJC] IS NOT NULL AND BMJC <> '' AND BMDM <> '33100000000x' ORDER BY Sort", "2");

                        break;
                }
                //  hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.[ParentID],de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1", "Alarm_EveryDayInfo");
                dUser = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.SJBM,us.BMDM FROM [dbo].[ACL_USER] us left join Entity en on us.BMDM = en.BMDM", "user");
            }
            else
            {
                if (sszd == "all")
                {
                    bmdm = ssdd;
                    ddtitle = context.Request.Form["ssddtext"];
                    switch (type)
                    {
                        case "5":
                            Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT en.BMDM, en.[BMDM] as ParentID,us.XM as [Contacts],de.[DevId],[AlarmType],ala.在线时长 from (SELECT [DevId],sum([VideLength]) as 在线时长,sum([FileSize]) as 文件大小,1 as AlarmType from [EveryDayInfo_ZFJLY]   where  [Time] >='" + begintime + "' and [Time] <='" + endtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH where " + sreachcondi + " de.[DevType]=" + type + " and de.BMDM in (select BMDM from childtable) ", "Alarm_EveryDayInfo");
                            break;
                        default:
                            Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT en.BMDM, en.[BMDM] as ParentID,us.XM as [Contacts],de.[DevId],[AlarmType],ala.在线时长,0 as 文件大小 from (SELECT [DevId],[AlarmType]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <> 6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType]  ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH where " + sreachcondi + " de.[DevType]=" + type + " and de.BMDM in (select BMDM from childtable) ", "Alarm_EveryDayInfo");
                            break;
                    }
                    //   hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID])SELECT convert(nvarchar(10),en.[ID]) as ParentID,de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1 and de.EntityId in (select ID from childtable)", "Alarm_EveryDayInfo");
                    dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT BMDM as [ID] ,BMJC as [Name] ,SJBM as [ParentID],BMJB as [Depth] from [Entity] where [BMDM] in (select BMDM from childtable)   order by sort", "2");
                    dUser = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.SJBM,us.BMDM FROM [ACL_USER] us left join Entity en on us.BMDM = en.BMDM where en.SJBM='"+ssdd+"'", "user");

                }
                else
                {
                    bmdm = sszd;
                    ddtitle = context.Request.Form["sszdtext"];
                    switch (type)
                    {
                        case "5":
                            Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM ,en.BMDM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType],ala.文件大小 from (SELECT [DevId],sum([VideLength]) as 在线时长,sum([FileSize]) as 文件大小,1 as AlarmType from [EveryDayInfo_ZFJLY]   where  [Time] >='" + begintime + "' and [Time] <='" + endtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where " + sreachcondi + " de.[DevType]=" + type + " and en.BMDM='" + sszd + "'", "Alarm_EveryDayInfo");
                            break;
                        default:
                            Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM ,en.BMDM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType],0 as 文件大小 from (SELECT [DevId],[AlarmType],sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <> 6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where " + sreachcondi + " de.[DevType]=" + type + " and en.BMDM='" + sszd + "'", "Alarm_EveryDayInfo");
                            break;
                    }
                    //  hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.[ParentID],de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1", "Alarm_EveryDayInfo");
                    dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM as ID,BMJC as Name,SJBM as ParentID,BMJB AS Depth from [Entity] a where [BMDM]  = '"+sszd+"'", "2");
                    dUser = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.SJBM,us.BMDM FROM [ACL_USER] us left join Entity en on us.BMDM = en.BMDM where en.BMDM='" + sszd + "'", "user");

                }
            }


            for (int i1 = 0; i1 < dtEntity.Rows.Count; i1++)
            {
                DataRow dr = dtreturns.NewRow();
                dr["cloum1"] = (i1 + 1).ToString(); ;
                dr["cloum2"] = dtEntity.Rows[i1]["Name"].ToString();
                
                dr["cloum13"] = (i1 + 1);
                Int64 在线时长 = 0;
                Int64 处理量 = 0;
                Int64 文件大小 = 0;
                Int64 查询量 = 0;
                int 无查询量 = 0;
                int 无处罚量 = 0;
                int 未使用 = 0;
                int usercount = 0;
                int 在线 = 0;
                int status = 0;//设备使用正常、周1次，月4次，季度12次
                var rows = from p in Alarm_EveryDayInfo.AsEnumerable()
                           where (p.Field<string>("ParentID") == dtEntity.Rows[i1]["ID"].ToString()|| p.Field<string>("BMDM") == dtEntity.Rows[i1]["ID"].ToString())
                           orderby p.Field<string>("DevId")
                           select p;
                //获得设备数量，及正常使用设备
                tmpRows = 0;
                foreach (var item in rows)
                {
                    if (item["在线时长"] is DBNull) { }
                    else
                    {
                        switch (item["AlarmType"].ToString())
                        {
                            case "1":
                                在线时长 += Convert.ToInt32(item["在线时长"]);
                                未使用+= ((Convert.ToInt32(item["在线时长"]) - statusvalue)<=0)?1:0;
                                在线 += ((Convert.ToInt32(item["在线时长"]) - zxstatusvalue) > 0) ? 1 : 0;
                                文件大小 += Convert.ToInt32(item["文件大小"]);
                                break;
                            case "2":
                                处理量 += Convert.ToInt32(item["在线时长"]);
                                无处罚量 += (Convert.ToInt32(item["在线时长"]) == 0) ? 1 : 0;
                                break;
                            case "5":
                                查询量 += Convert.ToInt32(item["在线时长"]);
                                无查询量 += (Convert.ToInt32(item["在线时长"]) == 0) ? 1 : 0;
                                break;
                        }
                        if (item["DevId"].ToString() != tmpDevid)
                        {
                            tmpRows += 1;  //新设备ID不重复
                            tmpDevid = item["DevId"].ToString();
                            status += (Convert.ToInt32(item["在线时长"]) - statusvalue > 0) ? 1 : 0;
                            allstatu_device += (Convert.ToInt32(item["在线时长"]) - statusvalue > 0) ? 1 : 0;
                        }

                    }


                }

                var userrows = from p in dUser.AsEnumerable()
                           where (p.Field<string>("SJBM") == dtEntity.Rows[i1]["ID"].ToString()|| p.Field<string>("BMDM") == dtEntity.Rows[i1]["ID"].ToString()) select p;
                usercount = userrows.Count();

                int countdevices = tmpRows;
                double deviceuse = Math.Round((double)status * 100 / (double)countdevices,2);

                dr["cloum3"] = countdevices;
                devicescount += countdevices;
      
            
                switch (type)
                {
                    case "4":
                    case "6":
                        dr["cloum4"] = usercount;   // dr["cloum4"] = 处理量;
                        hzusecount += usercount;
                        zxsc += 处理量;
                        cxl += 查询量;
                        dr["cloum5"] = Math.Round((double)处理量 / usercount, 2);
                        dr["cloum7"] = 查询量;
                        dr["cloum11"] = 无处罚量;
                        dr["cloum9"] = 处理量;//无处罚量;
                        dr["cloum6"] =(countdevices==0)?0:Math.Round((double)处理量 / countdevices, 2);
                        wcxl += 无查询量;
                        wcfl += 无处罚量;
                        dr["cloum10"] = 未使用;
                       
                        wsysb += 未使用;
                        pxstring = "cloum6";
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "5":
                        dr["cloum4"] = ((double)在线时长 / 3600).ToString("0.00");
                        zxsc += (double)在线时长 / 3600;
                        dr["cloum5"] = status;
                        dr["cloum6"] = countdevices - status;
                        dr["cloum9"] = ((double)文件大小 / 1048576).ToString("0.00"); //转换为GB
                        spdx += ((double)文件大小 / 1048576);
                        dr["cloum7"] = (countdevices != 0) ? (deviceuse) : 0;
                        pxstring = "cloum7";
                        break;
                    default:
                        break;
                }
                zxsb += 在线;
                dr["cloum14"] = 在线;
                dr["cloum12"] = dtEntity.Rows[i1]["ID"].ToString();
                dtreturns.Rows.Add(dr);
            }
            if (sszd!="all")
            {
                goto end;
            }
            int orderno = 1;
            var query = (from p in dtreturns.AsEnumerable()
                        orderby p.Field<double>(pxstring) descending
                         select p) as IEnumerable<DataRow>;
            double temsyl = 0.0;
            int temorder = 1;
            foreach (var item in query)
            {
                if (temsyl == double.Parse(item[pxstring].ToString()))
                {
                    item["cloum8"] = temorder;
                }
                else
                {
                    item["cloum8"] = orderno;
                
                    temsyl = double.Parse((item[pxstring].ToString()));
                    temorder = orderno;
                }
                orderno += 1;
            }

            query=query.OrderBy(p =>p["cloum13"]);
            dtreturns =query.CopyToDataTable<DataRow>();
            DataRow drtz = dtreturns.NewRow();
            drtz["cloum1"] = allstatu_device;
            drtz["cloum2"] = "合计";//ddtitle;
            drtz["cloum3"] = devicescount;
       
            drtz["cloum5"] = allstatu_device;
            switch (type)
            {
                case "4":
                case "6":
                    drtz["cloum7"] = cxl;
                    drtz["cloum4"] = hzusecount;
                    drtz["cloum5"] = (hzusecount == 0)?"0":(zxsc/ hzusecount).ToString("0.00");;
                    drtz["cloum11"] = wcfl;
                    drtz["cloum9"] = zxsc;//wcfl;
                    drtz["cloum10"] = wsysb;
                    drtz["cloum6"] = (devicescount == 0) ? "0" : (zxsc / devicescount).ToString("0.00");
                    break;
                case "1":
                case "2":
                case "3":
                case "5":
                    drtz["cloum6"] = devicescount - allstatu_device;
                    drtz["cloum4"] = zxsc.ToString("0.00");
                    drtz["cloum9"] = spdx.ToString("0.00");
                    Double sbsyl = (devicescount == 0) ? 0 : ((double)allstatu_device * 100 / devicescount);
                    drtz["cloum7"] = Math.Round(sbsyl, 2);
                    break;
                default:
                    break;
            }
            drtz["cloum14"] = zxsb;
            drtz["cloum12"] = bmdm;
            drtz["cloum8"] = "/";
            // drtz["环比"] = (hbhb.Contains("数字")) ? "-" : hbhb;
            dtreturns.Rows.Add(drtz);
        // dtreturns.Rows.InsertAt(drtz, 0);

        end:

            string reTitle = ExportExcel(dtreturns, type, begintime, endtime, title, ssdd, sszd, context.Request.Form["ssddtext"], context.Request.Form["sszdtext"]);
            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, reTitle));
        }



        public string ExportExcel(DataTable dt, string type, string begintime, string endtime, string entityTitle, string ssdd, string sszd, string ssddtext, string sszdtext)
        {
            ExcelFile excelFile = new ExcelFile();
            var tmpath = "";
            string Entityname = "";
            Entityname +=(ssddtext=="全部")?"台州交警局":ssddtext;
            Entityname += (sszdtext == "全部") ? "" : sszdtext;
            switch (type)
            {
                case "1":
                case "2":
                case "3":
                case "5":
                    tmpath= HttpContext.Current.Server.MapPath("templet\\1.xls");
                    break;
                case "4":
                case "6":
                    tmpath = HttpContext.Current.Server.MapPath("templet\\4.xls");
                    break;

            }
        
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];


            DateTime bg = Convert.ToDateTime(begintime);
            DateTime ed = Convert.ToDateTime(endtime);
            string typename = "";
            switch (type)
            {
                case "1":
                    typename = "车载视频";
                    break;
                case "2":
                    typename = "对讲机";
                    break;
                case "3":
                    typename = "拦截仪";
                    break;
                case "5":
                    typename = "执法记录仪";
                    break;
                case "4":
                    typename = "警务通";
                    break;
                case "6":
                    typename = "辅警通";
                    break;
            }
            

            sheet.Rows[0].Cells["A"].Value = begintime.Replace("/", "-") + "_" + endtime.Replace("/", "-") + Entityname + typename + "报表";
            switch (type)
            {
                case "1":
                case "2":
                case "3":
                case "5":
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["D"].Value = dt.Rows[i][3].ToString();
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][4].ToString();
                        sheet.Rows[i + 2].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["F"].Value = dt.Rows[i][5].ToString();
                        sheet.Rows[i + 2].Cells["G"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["G"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["H"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["H"].Value = dt.Rows[i][7].ToString();
                    }
                    break;
                case "4":
                case "6":
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["D"].Value = dt.Rows[i][3].ToString();
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][4].ToString();
                        sheet.Rows[i + 2].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["F"].Value = dt.Rows[i][5].ToString();
                        sheet.Rows[i + 2].Cells["G"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["G"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["H"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["H"].Value = dt.Rows[i][7].ToString();
                        sheet.Rows[i + 2].Cells["I"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["I"].Value = dt.Rows[i][8].ToString();
                        sheet.Rows[i + 2].Cells["J"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["J"].Value = dt.Rows[i][9].ToString();
                        sheet.Rows[i + 2].Cells["K"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["K"].Value = dt.Rows[i][10].ToString();

                    }

                    break;

            }
       

           tmpath = HttpContext.Current.Server.MapPath("upload\\" + sheet.Rows[0].Cells[0].Value + ".xls");

            excelFile.SaveXls(tmpath);
            return sheet.Rows[0].Cells[0].Value + ".xls";
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