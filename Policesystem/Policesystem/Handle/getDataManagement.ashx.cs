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
            dtreturns.Columns.Add("cloum6");
            dtreturns.Columns.Add("cloum7", typeof(double));
            dtreturns.Columns.Add("cloum8");
            dtreturns.Columns.Add("cloum9");
            dtreturns.Columns.Add("cloum10");
            dtreturns.Columns.Add("cloum11");
            int days = Convert.ToInt16(context.Request.Form["dates"]);
            int statusvalue = 10;  //正常参考值
            int devicescount = 0;  //汇总设备总数
            double zxsc = 0.0;  //汇总在线时长
            double spdx = 0.0;  //汇总视频大小
            Int64 cxl = 0;  //汇总查询量
            int wcxl = 0;   //无查询量设备数量
            int wcfl = 0;   //无处罚量设备数量
            int wsysb = 0;  //无使用设备数量
            int allstatu_device = 0;  //汇总使用率不为空数量
            string ddtitle;//大队标题


            statusvalue = days * 600;//超过10分钟算使用

            DataTable Alarm_EveryDayInfo = null; //每日告警
            DataTable dUser = null;







            //所有大队
            if (ssdd == "all")
            {

                ddtitle = "台州交警局";
                Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM, en.SJBM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType] from (SELECT [DevId],[AlarmType],sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <>6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where de.[DevType]=" + type, "Alarm_EveryDayInfo");
                //  hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.[ParentID],de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1", "Alarm_EveryDayInfo");
                dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "SELECT BMDM as ID,BMJC as Name,SJBM as ParentID,BMJB AS Depth from [Entity] a where [SJBM]  = '331000000000' and BMMC like '台州市交通警察支队直属%' ORDER BY Sort", "2");
                dUser = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.SJBM,us.BMDM FROM [dbo].[ACL_USER] us left join Entity en on us.BMDM = en.BMDM", "user");
            }
            else
            {
                if (sszd == "all")
                {
                    ddtitle = context.Request.Form["ssddtext"];
                    Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '"+ ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT en.BMDM, en.[BMDM] as ParentID,us.XM as [Contacts],de.[DevId],[AlarmType],ala.在线时长 from (SELECT [DevId],[AlarmType]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <> 6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType]  ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH where de.[DevType]=" + type + " and de.BMDM in (select BMDM from childtable) ", "Alarm_EveryDayInfo");
                    //   hbAlarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(Name,ID,ParentID) as (SELECT Name,ID,ParentID FROM [Entity] WHERE id=" + ssdd + " UNION ALL SELECT A.[Name],A.[ID],A.[ParentID] FROM [Entity] A,childtable b where a.[ParentID] = b.[ID])SELECT convert(nvarchar(10),en.[ID]) as ParentID,de.[Contacts],de.[DevId],ala.在线时长 from (SELECT [DevId]  ,sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] = 1 and  [AlarmDay ] >='" + hbbegintime + "' and [AlarmDay ] <='" + hbendtime + "'   group by [DevId] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[ID] = de.[EntityId] where de.[DevType]=1 and de.EntityId in (select ID from childtable)", "Alarm_EveryDayInfo");
                    dtEntity = SQLHelper.ExecuteRead(CommandType.Text, "WITH childtable(BMMC,BMDM,SJBM) as (SELECT BMMC,BMDM,SJBM FROM [Entity] WHERE SJBM= '" + ssdd + "' OR BMDM = '" + ssdd + "' UNION ALL SELECT A.BMMC,A.BMDM,A.SJBM FROM [Entity] A,childtable b where a.SJBM = b.BMDM ) SELECT BMDM as [ID] ,BMJC as [Name] ,SJBM as [ParentID],BMJB as [Depth] from [Entity] where [BMDM] in (select BMDM from childtable)   order by sort", "2");
                    dUser = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.SJBM,us.BMDM FROM [ACL_USER] us left join Entity en on us.BMDM = en.BMDM where en.SJBM='"+ssdd+"'", "user");

                }
                else
                {
                    ddtitle = context.Request.Form["sszdtext"];
                    Alarm_EveryDayInfo = SQLHelper.ExecuteRead(CommandType.Text, "SELECT en.BMDM ,en.BMDM as [ParentID],us.XM as [Contacts],de.[DevId],ala.在线时长,ala.[AlarmType] from (SELECT [DevId],[AlarmType],sum([Value]) as 在线时长 from [Alarm_EveryDayInfo]   where [AlarmType] <> 6 and  [AlarmDay ] >='" + begintime + "' and [AlarmDay ] <='" + endtime + "'   group by [DevId],[AlarmType] ) as ala left join [Device] as de on de.[DevId] = ala.[DevId] left join [Entity] as en on en.[BMDM] = de.[BMDM] left join ACL_USER as us on de.JYBH = us.JYBH  where de.[DevType]=" + type+" and en.BMDM='"+sszd+"'", "Alarm_EveryDayInfo");
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
                Int64 在线时长 = 0;
                Int64 视频大小 = 0;
                Int64 处理量 = 0;
                Int64 文件大小 = 0;
                Int64 查询量 = 0;
                int 无查询量 = 0;
                int 无处罚量 = 0;
                int 未使用 = 0;
                int usercount = 0;

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
                                未使用+= ((Convert.ToInt32(item["在线时长"]) - statusvalue)<0)?1:0;
                                break;
                            case "2":
                                处理量 += Convert.ToInt32(item["在线时长"]);
                                无处罚量 += (Convert.ToInt32(item["在线时长"]) == 0) ? 1 : 0;
                                break;
                            case "3":
                                文件大小 += Convert.ToInt32(item["在线时长"]);
                                break;
                            case "4":
                                视频大小 += Convert.ToInt32(item["在线时长"]);
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
                            status += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
                            allstatu_device += (Convert.ToInt32(item["在线时长"]) / statusvalue >= 1) ? 1 : 0;
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
                        dr["cloum4"] = 处理量;
                        zxsc += 处理量;
                        cxl += 查询量;
                        dr["cloum5"] = Math.Round((double)处理量 / usercount, 2);
                        dr["cloum6"] = 查询量;
                        dr["cloum11"] = 无查询量;
                        dr["cloum9"] = 无处罚量;
                        wcxl += 无查询量;
                        wcfl += 无处罚量;
                        dr["cloum10"] = 未使用;
                        wsysb += 未使用;
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "5":
                        dr["cloum4"] = ((double)在线时长 / 3600).ToString("0.0");
                        zxsc += (double)在线时长 / 3600;
                        dr["cloum5"] = status;
                        dr["cloum6"] = countdevices - status;
                        break;
                    default:
                        break;
                }              
                
              
                dr["cloum7"] = (countdevices != 0) ? (deviceuse):0;
                dtreturns.Rows.Add(dr);
            }
            if (sszd!="all")
            {
                goto end;
            }
            int orderno = 1;
            var query = (from p in dtreturns.AsEnumerable()
                        orderby p.Field<double>("cloum7") descending
                         select p) as IEnumerable<DataRow>;
            double temsyl = 0.0;
            int temorder = 1;
            foreach (var item in query)
            {
                if (temsyl == double.Parse(item["cloum7"].ToString()))
                {
                    item["cloum8"] = temorder;

                }
                else
                {
                    item["cloum8"] = orderno;
                    temsyl = double.Parse((item["cloum7"].ToString()));
                    temorder = orderno;
                }
                orderno += 1;
            }

            query=query.OrderBy(p => p["cloum1"]);
            dtreturns =query.CopyToDataTable<DataRow>();
            DataRow drtz = dtreturns.NewRow();
            drtz["cloum1"] = "汇总";
            drtz["cloum2"] = ddtitle;
            drtz["cloum3"] = devicescount;
       
            drtz["cloum5"] = allstatu_device;
            switch (type)
            {
                case "4":
                case "6":
                    drtz["cloum6"] = cxl;
                    drtz["cloum4"] = zxsc;
                    drtz["cloum11"] = wcxl;
                    drtz["cloum9"] = wcfl;
                    drtz["cloum10"] = wsysb;
                    break;
                case "1":
                case "2":
                case "3":
                case "5":
                    drtz["cloum6"] = devicescount - allstatu_device;
                    drtz["cloum4"] = zxsc.ToString("0.0");
                    break;
                default:
                    break;
            }

            //  drtz["视频大小"] = spdx.ToString("0.00");
            Double sbsyl = ((double)allstatu_device * 100 / devicescount) ;
            drtz["cloum7"] = Math.Round(sbsyl,2);
            // drtz["环比"] = (hbhb.Contains("数字")) ? "-" : hbhb;
            dtreturns.Rows.InsertAt(drtz, 0);

        end:

            string reTitle = "";// ExportExcel(dtreturns, type, begintime, endtime, title, ssdd, sszd, context.Request.Form["ssddtext"], context.Request.Form["sszdtext"]);
            context.Response.Write(JSON.DatatableToDatatableJS(dtreturns, reTitle));
        }



        public string ExportExcel(DataTable dt, string type, string begintime, string endtime, string entityTitle, string ssdd, string sszd, string ssddtext, string sszdtext)
        {
            ExcelFile excelFile = new ExcelFile();


            var tmpath = HttpContext.Current.Server.MapPath("templet\\" + type + ".xls");
            excelFile.LoadXls(tmpath);
            ExcelWorksheet sheet = excelFile.Worksheets[0];


            DateTime bg = Convert.ToDateTime(begintime);
            DateTime ed = Convert.ToDateTime(endtime);
            int days = (ed - bg).Days;
            string title = "";

            if (days >= 190) //季度
            {
                title = bg.Year.ToString() + "年";
            }
            else if (days > 100 && days < 190) //季度
            {
                if (bg.Month >= 6)
                {
                    title = "下半年";
                }
                else
                {
                    title = "上半年";
                }
                title = bg.Year.ToString() + "年" + title;
            }
            else if (days > 31 && days < 100) //季度
            {
                if (bg.Month > 9)
                {
                    title = "第四季度";
                }
                else if (6 < bg.Month && bg.Month <= 9)
                {
                    title = "第三季度";
                }
                else if (3 < bg.Month && bg.Month <= 6)
                {
                    title = "第二季度";
                }
                else
                {
                    title = "第一季度";
                }
                title = bg.Year.ToString() + "年" + title;

            }
            else if (days > 7) //季度
            {
                title = bg.Year.ToString() + "年" + bg.Month.ToString() + "月份";
            }
            else if (days <= 7) //周
            {
                title = begintime.Replace("/", "-") + "_" + endtime.Replace("/", "-");
            }




            switch (type)
            {
                case "1":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "车载视频在线时长报表";
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        if (i == 0)
                        {
                            sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["A"].Value = Convert.ToInt32(dt.Rows[i][0].ToString());
                        }

                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                        if (ssdd != "all")
                        {
                            if (sszd != "all")
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                            }
                            else
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                                // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                                if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                            }
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                            //  sheet.Rows[i + 2].Cells["C"].Value = "/";

                        }
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    }
                    sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
                    sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                    break;
                case "2":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "对讲机在线时长报表";
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                        if (ssdd != "all")
                        {
                            if (sszd != "all")
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                            }
                            else
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                                // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                                if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                            }
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();

                        }
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    }
                    sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
                    sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                    break;
                case "3":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "拦截仪在线时长报表";
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                        if (ssdd != "all")
                        {
                            if (sszd != "all")
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                            }
                            else
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                                // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                                if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                            }
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        }
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["E"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    }
                    sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
                    sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 4).Merged = true;
                    break;

                case "4":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "移动警务通报表";
                    sheet.Rows[3].Cells["B"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 3].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        sheet.Rows[i + 3].Cells["A"].Value = i + 1;
                        sheet.Rows[i + 3].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["B"].Value = dt.Rows[i][0].ToString();
                        sheet.Rows[i + 3].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["C"].Value = dt.Rows[i][1].ToString();
                        sheet.Rows[i + 3].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["D"].Value = dt.Rows[i][2].ToString();
                        sheet.Rows[i + 3].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["E"].Value = dt.Rows[i][3].ToString();
                        sheet.Rows[i + 3].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["F"].Value = dt.Rows[i][4].ToString();
                        sheet.Rows[i + 3].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["G"].Value = dt.Rows[i][5].ToString();
                        sheet.Rows[i + 3].Cells["G"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                        sheet.Rows[i + 3].Cells["H"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 3].Cells["H"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["I"].Value = dt.Rows[i][7].ToString();
                        sheet.Rows[i + 3].Cells["I"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["J"].Value = dt.Rows[i][8].ToString();
                        sheet.Rows[i + 3].Cells["J"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["K"].Value = dt.Rows[i][9].ToString();
                        sheet.Rows[i + 3].Cells["K"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["L"].Value = dt.Rows[i][10].ToString();
                        sheet.Rows[i + 3].Cells["L"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["M"].Value = dt.Rows[i][11].ToString();
                        sheet.Rows[i + 3].Cells["M"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["N"].Value = dt.Rows[i][12].ToString();
                        sheet.Rows[i + 3].Cells["N"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["O"].Value = dt.Rows[i][13].ToString();
                        sheet.Rows[i + 3].Cells["O"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 3].Cells["P"].Value = dt.Rows[i][14].ToString();
                        sheet.Rows[i + 3].Cells["P"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                    }
                    sheet.Rows[dt.Rows.Count + 3].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内时长大于10分钟  ";
                    sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 3, 0, dt.Rows.Count + 3, dt.Columns.Count - 1).Merged = true;
                    break;
                case "5":
                    sheet.Rows[0].Cells[0].Value = title + entityTitle + "执法记录仪在线时长报表";
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        sheet.Rows[i + 2].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        if (i == 0)
                        {
                            sheet.Rows[i + 2].Cells["A"].Value = dt.Rows[i][0].ToString();
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["A"].Value = Convert.ToInt32(dt.Rows[i][0].ToString());
                        }

                        sheet.Rows[i + 2].Cells["A"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);


                        if (ssdd != "all")
                        {
                            if (sszd != "all")
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = (i != 0) ? dt.Rows[i][3].ToString() : dt.Rows[i][1].ToString();

                            }
                            else
                            {
                                sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[0][1].ToString();
                                // sheet.Rows[i + 2].Cells["C"].Value = dt.Rows[i][2].ToString();
                                if (i != 0) sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                            }
                        }
                        else
                        {
                            sheet.Rows[i + 2].Cells["B"].Value = dt.Rows[i][1].ToString();
                        }
                        sheet.Rows[i + 2].Cells["B"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["C"].Value = Convert.ToInt32(dt.Rows[i][4].ToString());
                        sheet.Rows[i + 2].Cells["C"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["D"].Value = Convert.ToDouble(dt.Rows[i][5].ToString());
                        sheet.Rows[i + 2].Cells["D"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["E"].Value = Convert.ToDouble(dt.Rows[i][7].ToString());
                        sheet.Rows[i + 2].Cells["E"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

                        sheet.Rows[i + 2].Cells["F"].Value = dt.Rows[i][6].ToString();
                        sheet.Rows[i + 2].Cells["F"].Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);
                    }
                    sheet.Rows[dt.Rows.Count + 2].Cells[0].Value = "计算公式：设备使用率为 （设备使用数量/设备配发数 *100%），设备使用标准为查询时间段内视频时长大于10分钟  ";
                    sheet.Cells.GetSubrangeAbsolute(dt.Rows.Count + 2, 0, dt.Rows.Count + 2, dt.Columns.Count - 3).Merged = true;
                    break;
                default:

                    break;
            }


            //sheet.GetUsedCellRange(true).Style.Borders.SetBorders(MultipleBorders.Outside, Color.FromArgb(0, 0, 0), LineStyle.Thin);

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