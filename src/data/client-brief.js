// Confirmed requirements from the supplied business brief. These describe requested modules,
// not implementation status or detailed operating rules.
export const clientBriefFacts = Object.freeze({
  "dashboard.monthly_counts": { value:["walks","visits","boarding"], source:"client_brief", status:"confirmed", evidence:"brief.1.dashboard", dependsOn:[] },
  "dashboard.historical_chart": { value:"bar_chart", source:"client_brief", status:"confirmed", evidence:"brief.1.dashboard", dependsOn:[] },
  "dashboard.staff_summary": { value:["staff","services","hours"], source:"client_brief", status:"confirmed", evidence:"brief.1.dashboard", dependsOn:[] },
  "clients.linked_pets": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.2.linked_records", dependsOn:[] },
  "animal.mobile_profile": { value:["medical_alerts","character","fears","hiding","food","medication","allergies","vet","keys","access_instructions"], source:"client_brief", status:"confirmed", evidence:"brief.3.mobile_profile", dependsOn:[] },
  "orders.admin_entry": { value:["client","pet","service","quantity","price","create_missions"], source:"client_brief", status:"confirmed", evidence:"brief.4.service_entry", dependsOn:[] },
  "staff.daily_timeline": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.5.staff_planning", dependsOn:[] },
  "staff.map_link": { value:["Google Maps","Apple Maps"], source:"client_brief", status:"confirmed", evidence:"brief.5.staff_planning", dependsOn:[] },
  "clients.map": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.6.admin_map", dependsOn:[] },
  "clients.address_search": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.6.admin_map", dependsOn:[] },
  "geo.client_distance_km": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.6.admin_map", dependsOn:[] },
  "staff.employee_location": { value:null, source:"client_brief", status:"unknown", evidence:"brief.6.admin_map", dependsOn:[] },
  "backoffice.staff_columns": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.7.backoffice", dependsOn:[] },
  "backoffice.drag_reassign": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.7.backoffice", dependsOn:[] },
  "backoffice.import": { value:true, source:"client_brief", status:"confirmed", evidence:"brief.7.backoffice", dependsOn:[] },
  "features.live_gps": { value:null, source:"client_brief", status:"unknown", evidence:"brief.1-7.not_confirmed", dependsOn:[] },
  "features.customer_portal": { value:null, source:"client_brief", status:"unknown", evidence:"brief.1-7.not_confirmed", dependsOn:[] }
});
